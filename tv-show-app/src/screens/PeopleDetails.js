import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, Linking, ScrollView } from 'react-native';

export default function PeopleDetailsScreen({ route, navigation }) {

    const [personData, setPersonData] = useState();
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

    useEffect(() => {
        getPersonData();
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

    noImage: {
        backgroundColor: '#b2bec3',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center'
    }
});