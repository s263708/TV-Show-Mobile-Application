import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, Linking, ScrollView, FlatList, Pressable } from 'react-native';

export default function PeopleDetailsScreen({ route, navigation }) {

    const [personData, setPersonData] = useState();
    const [castCredits, setCastCredits] = useState();
    const { personId } = route.params;

    const getPersonData = () => {
        fetch('https://api.tvmaze.com/people/' + personId)
        .then((response) => response.json())
        .then((json) => {
            setPersonData(json);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    const getCastCredits = () => {
        fetch('https://api.tvmaze.com/people/' + personId + '/castcredits?embed=show')
        .then((response) => response.json())
        .then((json) => {
            setCastCredits(json);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    useEffect(() => {
        getPersonData();
        getCastCredits();
    }, [personId]);

    return (
        <View style={styles.PeopleDetailsScreen}>
            {personData ? (
                <ScrollView style={styles.detailsContainer}>
                    {personData.image ? (
                        <Image
                            style={styles.personImage}
                            source={{ uri: personData.image.original }}
                        />
                    ) : (
                        <View style={styles.noImage}>
                            <Text>No Preview</Text>
                        </View>
                    )}

                    <View style={styles.metaDataContainer}>
                        <Text style={styles.metaDataText}>
                            <Text style={{ fontWeight: 'bold' }}>Name:</Text> {personData.name}
                        </Text>
                        <Text style={styles.metaDataText}>
                            <Text style={{ fontWeight: 'bold' }}>Gender:</Text> {personData.gender ? personData.gender : 'N/A'}
                        </Text>
                        <Text style={styles.metaDataText}>
                            <Text style={{ fontWeight: 'bold' }}>Birthday:</Text> {personData.birthday ? personData.birthday : 'N/A'}
                        </Text>
                        <Text style={styles.metaDataText}>
                            <Text style={{ fontWeight: 'bold' }}>Country:</Text> {personData.country ? personData.country.name : 'N/A'}
                        </Text>
                        <Text
                            onPress={() => { Linking.openURL(personData.url) }}
                            style={[styles.metaDataText, { marginTop: 10 }]}
                        >
                            <Text style={{ fontWeight: 'bold' }}>View Person:</Text> click here
                        </Text>
                    </View>

                    <View style={styles.castContainer}>
                        <Text style={styles.castHeading}>Starred in</Text>

                        {castCredits && castCredits.length > 0 ? (
                            <FlatList
                                data={castCredits}
                                scrollEnabled={false}
                                keyExtractor={(item, index) =>
                                    item._embedded && item._embedded.show
                                        ? item._embedded.show.id.toString() + '-' + index
                                        : index.toString()
                                }
                                numColumns={2}
                                renderItem={({ item }) => (
                                    item._embedded && item._embedded.show ? (
                                        <Pressable
                                            style={styles.resultImagePressable}
                                            onPress={() => {
                                                navigation.navigate('Show Details', {
                                                    showId: item._embedded.show.id,
                                                });
                                            }}
                                        >
                                            {item._embedded.show.image ? (
                                                <Image
                                                    style={styles.resultImage}
                                                    source={{ uri: item._embedded.show.image.medium }}
                                                />
                                            ) : (
                                                <View style={styles.showNoImage}>
                                                    <Text>No Preview</Text>
                                                </View>
                                            )}
                                            <Text style={styles.resultText}>{item._embedded.show.name}</Text>
                                        </Pressable>
                                    ) : null
                                )}
                                style={{ marginBottom: 20 }}
                            />
                        ) : (
                            <Text style={styles.metaDataText}>No TV credits found</Text>
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
    PeopleDetailsScreen: {
        flex: 1,
    },

    detailsContainer: {

    },

    loadingContainer: {
        height: '100%',
        justifyContent: 'center',
    },

    personImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
    },

    metaDataContainer: {
        margin: 20,
    },

    metaDataText: {
        fontSize: 17,
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

    resultImage: {
        flex: 1,
        height: 200,
    },

    resultImagePressable: {
        flex: 1,
        margin: 10,
        height: 240,
    },

    resultText: {
        marginTop: 5,
        textAlign: 'center',
    },

    showNoImage: {
        backgroundColor: '#b2bec3',
        height: 200,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    noImage: {
        backgroundColor: '#b2bec3',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center'
    }
});