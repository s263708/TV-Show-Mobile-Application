import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, Linking, ScrollView, FlatList, Pressable } from 'react-native';

export default function ShowDetailsScreen({ route, navigation }) {

    const [showData, setShowData] = useState();
    const [castData, setCastData] = useState();
    const { showId } = route.params;

    const getShowData = () => {
        fetch('https://api.tvmaze.com/shows/' + showId)
        .then((response) => response.json())
        .then((json) => {
            setShowData(json);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    const getCastData = () => {
        fetch('https://api.tvmaze.com/shows/' + showId + '/cast')
        .then((response) => response.json())
        .then((json) => {
            setCastData(json);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    useEffect(() => {
        getShowData();
        getCastData();
    }, [showId]);

    return (
        <View style={styles.ShowDetailsScreen}>
            {showData ? (
                <ScrollView style={styles.detailsContainer}>
                    <Image
                        style={styles.showImage}
                        source={{
                            uri: showData.image
                                ? showData.image.original
                                : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
                        }}
                    />

                    <View style={styles.metaDataContainer}>
                        <Text style={styles.metaDataText}>
                            <Text style={{ fontWeight: 'bold' }}>Show Name:</Text> {showData.name}
                        </Text>
                        <Text style={styles.metaDataText}>
                            <Text style={{ fontWeight: 'bold' }}>Language:</Text> {showData.language}
                        </Text>
                        <Text style={styles.metaDataText}>
                            <Text style={{ fontWeight: 'bold' }}>Genres:</Text> {showData.genres && showData.genres.length > 0 ? showData.genres.join(', ') : 'N/A'}
                        </Text>
                        <Text style={styles.metaDataText}>
                            <Text style={{ fontWeight: 'bold' }}>Rating:</Text> {showData.rating && showData.rating.average ? showData.rating.average : 'N/A'}
                        </Text>
                        <Text style={styles.metaDataText}>
                            <Text style={{ fontWeight: 'bold' }}>Premiered:</Text> {showData.premiered ? showData.premiered : 'N/A'}
                        </Text>
                        <Text
                            onPress={() => { Linking.openURL(showData.url) }}
                            style={[styles.metaDataText, { marginTop: 10 }]}
                        >
                            <Text style={{ fontWeight: 'bold' }}>View Show:</Text> click here
                        </Text>
                        <Text style={[styles.metaDataText, { marginTop: 10 }]}>
                            <Text style={{ fontWeight: 'bold' }}>Summary:</Text>{' '}
                            {showData.summary ? showData.summary.replace(/<[^>]*>/g, '') : 'No summary available'}
                        </Text>
                    </View>

                    <View style={styles.castContainer}>
                        <Text style={styles.castHeading}>Cast</Text>

                        {castData && castData.length > 0 ? (
                            <FlatList
                                data={castData}
                                scrollEnabled={false}
                                numColumns={2}
                                keyExtractor={(item, index) => item.person.id.toString() + '-' + index}
                                renderItem={({ item }) => (
                                    <Pressable
                                        style={styles.castItem}
                                        onPress={() => {
                                            navigation.navigate('People Details', {
                                                personId: item.person.id,
                                            });
                                        }}
                                    >
                                        {item.person.image ? (
                                            <Image
                                                style={styles.castImage}
                                                source={{ uri: item.person.image.medium }}
                                            />
                                        ) : (
                                            <View style={styles.noCastImage}>
                                                <Text>No Preview</Text>
                                            </View>
                                        )}
                                        <Text style={styles.castName}>{item.person.name}</Text>
                                        <Text style={styles.characterName}>
                                            {item.character ? item.character.name : 'Unknown Role'}
                                        </Text>
                                    </Pressable>
                                )}
                                style={{ marginBottom: 20 }}
                            />
                        ) : (
                            <Text style={styles.metaDataText}>No cast found</Text>
                        )}
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#000"/>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    ShowDetailsScreen: {
        flex: 1,
    },

    detailsContainer: {
    },

    loadingContainer: {
        height: '100%',
        justifyContent: 'center',
    },

    showImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
    },

    metaDataContainer: {
        margin: 20,
    },

    metaDataText: {
        fontSize: 17,
        marginBottom: 8,
    },

    castContainer: {
        marginHorizontal: 10,
        marginBottom: 20,
    },

    castHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 10,
        marginBottom: 10,
    },

    castItem: {
        flex: 1,
        margin: 10,
        height: 260,
    },

    castImage: {
        flex: 1,
        height: 200,
    },

    noCastImage: {
        backgroundColor: '#b2bec3',
        height: 200,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    castName: {
        marginTop: 5,
        textAlign: 'center',
        fontWeight: 'bold',
    },

    characterName: {
        textAlign: 'center',
    },
});