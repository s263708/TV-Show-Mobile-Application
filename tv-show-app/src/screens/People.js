import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, Pressable, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchForm from '../components/SearchForm';

export default function PeopleScreen({ navigation }) {

    const [searchQuery, setSearchQuery] = useState('Tom');
    const [people, setPeople] = useState();

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height; // checks screen orientation

    const searchPeople = () => {
        fetch('https://api.tvmaze.com/search/people?q=' + searchQuery)
        .then((response) => response.json())
        .then((json) => {
            setPeople(json); // stores API results in state
        })
        .catch((error) => {
            console.error(error);
        });
    };

    useEffect(() => {
        searchPeople(); // runs again whenever the search query changes
    }, [searchQuery]);

    return (
        <SafeAreaView style={styles.PeopleScreen} edges={['left', 'right', 'bottom']}>

            <SearchForm type="people" setSearchQuery={setSearchQuery} />

            {people ? (
                <View style={styles.resultsContainer}>
                    <FlatList
                        key={isLandscape ? 'landscape' : 'portrait'} // refreshes layout on rotate
                        numColumns={isLandscape ? 3 : 2}
                        contentContainerStyle={styles.listContent}
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
                                        <Text style={styles.noImageText}>No Preview</Text>
                                    </View>
                                )}
                                <Text style={styles.resultText}>{item.person.name}</Text>
                            </Pressable>
                        )}
                    />
                </View>
            ) : (
                <View style={styles.loadingContainer}>
                    {/* shown while waiting for API results */}
                    <ActivityIndicator size="large" color="#d9aebb"/>
                </View>
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    PeopleScreen: {
        flex: 1,
        backgroundColor: '#000',
    },

    resultsContainer: {
        flex: 1,
    },

    listContent: {
        padding: 10,
        paddingBottom: 25
    },

    loadingContainer: {
        height: '100%',
        justifyContent: 'center',
    },

    resultImage: {
        width: '100%',
        height: 200,
        borderRadius: 10
    },

    resultImagePressable: {
        flex: 1,
        margin: 10,
        minHeight: 240,
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 8
    },

    resultText: {
        marginTop: 8,
        textAlign: 'center',
        color: '#fff7fb',
        fontWeight: '600'
    },

    noImage: {
        backgroundColor: '#d9aebb',
        height: 200,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },

    noImageText: {
        color: '#000',
        fontWeight: '600'
    }
});