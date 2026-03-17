import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, Pressable } from 'react-native';
import SearchForm from '../components/SearchForm';

export default function PeopleScreen({ navigation }) {

    const [searchQuery, setSearchQuery] = useState('Tom');
    const [people, setPeople] = useState();

    const searchPeople = () => {
        fetch('https://api.tvmaze.com/search/people?q=' + searchQuery)
        .then((response) => response.json())
        .then((json) => {
            setPeople(json);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    useEffect(() => {
        searchPeople();
    }, [searchQuery]);

    return (
        <View style={styles.PeopleScreen}>

            <SearchForm type="people" setSearchQuery={setSearchQuery} />

            {people ? (
                <View style={styles.resultsContainer}>
                    <FlatList
                        numColumns={2}
                        style={{ margin: 10, marginBottom: 100 }}
                        data={people}
                        keyExtractor={(item) => item.person.id.toString()}
                        renderItem={({ item }) => (
                            <Pressable
                                style={styles.resultImagePressable}
                                onPress={() => {
                                    navigation.navigate('People Details', {
                                        personId: item.person.id,
                                    });
                                }}
                            >
                                {item.person.image ? (
                                    <Image
                                        style={styles.resultImage}
                                        source={{ uri: item.person.image.medium }}
                                    />
                                ) : (
                                    <View style={styles.noImage}>
                                        <Text>No Preview</Text>
                                    </View>
                                )}
                                <Text style={styles.resultText}>{item.person.name}</Text>
                            </Pressable>
                        )}
                    />
                </View>
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#000"/>
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    PeopleScreen: {
        flex: 1,
    },

    resultsContainer: {
        flex: 1,
    },

    loadingContainer: {
        height: '100%',
        justifyContent: 'center',
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

    noImage: {
        backgroundColor: '#b2bec3',
        height: 200,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});