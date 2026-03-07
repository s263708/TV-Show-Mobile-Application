import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, Linking } from 'react-native';

export default function ShowDetailsScreen({ route, navigation }) {

    const [showData, setShowData] = useState();

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

    useEffect(() => {
        getShowData();
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
                    <ScrollView style={styles.metaDataContainer}>
                        <Text style={styles.metaDataText}>
                            <Text style={{ fontWeight: 'bold' }}>Show Name:</Text> {showData.name}</Text>
                        <Text style={styles.metaDataText}>
                            <Text style={{ fontWeight: 'bold' }}>Language:</Text> {showData.language}</Text>
                        <Text style={styles.metaDataText}>
                            <Text style={{ fontWeight: 'bold' }}>Genres:</Text> {showData.genres.join(', ')}</Text>
                        <Text style={styles.metaDataText}>
                            <Text style={{ fontWeight: 'bold' }}>Rating:</Text> {showData.rating.average}</Text>
                        <Text style={styles.metaDataText}>
                            <Text style={{ fontWeight: 'bold' }}>Premiered:</Text> {showData.premiered}</Text>
                        <Text onPress={() => { Linking.openURL(showData.url) }} style={[styles.metaDataText, { marginTop: 10 }]}>
                            <Text style={{ fontWeight: 'bold' }}>View Show:</Text> click here</Text>
                        <Text style={[styles.metaDataText, { marginTop: 10 }]}> <Text style={{ fontWeight: 'bold' }}>Summary:</Text>{' '} {showData.summary ? showData.summary.replace(/<[^>]*>/g, '') : 'No summary available'}</Text>
                    </ScrollView>
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
});