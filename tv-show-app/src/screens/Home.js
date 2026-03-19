import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {

    const { width } = useWindowDimensions();

    const [topShows, setTopShows] = useState([]);

    const [popularPeople, setPopularPeople] = useState([]);

    const [loadingShows, setLoadingShows] = useState(true);

    const [loadingPeople, setLoadingPeople] = useState(true);

    const topShowIds = [169, 82, 431, 2993, 66, 526];
    
    const popularPeopleIds = [14245, 14079, 24483, 2168, 6384, 4304];

    useEffect(() => {
        const getTopShows = async () => {
            try {
                const responses = await Promise.all(
                    topShowIds.map((id) =>
                        fetch('https://api.tvmaze.com/shows/' + id).then((response) => response.json())
                    )
                );

                setTopShows(responses);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingShows(false);
            }
        };

        const getPopularPeople = async () => {
            try {
                const responses = await Promise.all(
                    popularPeopleIds.map((id) =>
                        fetch('https://api.tvmaze.com/people/' + id).then((response) => response.json())
                    )
                );

                setPopularPeople(responses);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingPeople(false);
            }
        };

        getTopShows();
        getPopularPeople();
    }, []);

    return (
        <SafeAreaView style={styles.HomeScreen} edges={['left', 'right', 'bottom']}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>SeriesScope</Text>
                    <Text style={styles.subtitle}>Discover popular shows and actors!</Text>
                </View>

                <View style={[styles.topButtons, width < 380 && styles.topButtonsSmall]}>
                    <Pressable style={styles.topButton} onPress={() => navigation.navigate('Shows')}>
                        <Text style={styles.topButtonText}>Shows</Text>
                    </Pressable>

                    <Pressable style={styles.topButton} onPress={() => navigation.navigate('People')}>
                        <Text style={styles.topButtonText}>People</Text>
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Popular Shows</Text>
                        <Text style={styles.sectionSubtitle}>Tap a show to open its details</Text>
                    </View>

                    {loadingShows ? (
                        <View style={styles.loadingRow}>
                            <ActivityIndicator size="large" color="#d9aebb" />
                        </View>
                    ) : (
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalList}
                        >
                            {topShows.map((show) => (
                                <Pressable
                                    key={show.id}
                                    style={styles.showCard}
                                    onPress={() => navigation.navigate('Shows', {
                                        screen: 'Show Details',
                                        params: {
                                            showId: show.id,
                                        }
                                    })}
                                >
                                    <Image
                                        source={{
                                            uri: show.image
                                                ? show.image.original
                                                : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
                                        }}
                                        style={styles.showImage}
                                    />
                                    <View style={styles.showInfoBox}>
                                        <Text style={styles.showName}>{show.name}</Text>
                                        <Text style={styles.showInfo}>
                                            {show.genres && show.genres.length > 0 ? show.genres.slice(0, 2).join(', ') : 'TV Show'}
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Popular Actors</Text>
                        <Text style={styles.sectionSubtitle}>Tap an actor to open their profile</Text>
                    </View>

                    {loadingPeople ? (
                        <View style={styles.loadingRow}>
                            <ActivityIndicator size="large" color="#d9aebb" />
                        </View>
                    ) : (
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalList}
                        >
                            {popularPeople.map((person) => (
                                <Pressable
                                    key={person.id}
                                    style={styles.personCard}
                                    onPress={() => navigation.navigate('People', {
                                        screen: 'People Details',
                                        params: {
                                            personId: person.id,
                                        }
                                    })}
                                >
                                    <Image
                                        source={{
                                            uri: person.image
                                                ? person.image.original
                                                : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
                                        }}
                                        style={styles.personImage}
                                    />
                                    <View style={styles.personInfoBox}>
                                        <Text style={styles.personName}>{person.name}</Text>
                                        <Text style={styles.personInfo}>
                                            {person.country ? person.country.name : 'Actor'}
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    HomeScreen: {
        flex: 1,
        backgroundColor: '#2f2f34',
    },

    scrollView: {
        padding: 20,
        paddingBottom: 30
    },

    headerContainer: {
        marginBottom: 18
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff7fb',
        marginBottom: 6
    },

    subtitle: {
        fontSize: 16,
        color: '#f0d8e1',
        lineHeight: 22
    },

    topButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 28
    },

    topButtonsSmall: {
        gap: 10
    },

    topButton: {
        flex: 0.48,
        backgroundColor: '#d9aebb',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    topButtonText: {
        color: '#2f2f34',
        fontSize: 15,
        fontWeight: 'bold'
    },

    section: {
        marginBottom: 28
    },

    sectionHeader: {
        marginBottom: 14
    },

    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff7fb',
        marginBottom: 4
    },

    sectionSubtitle: {
        fontSize: 14,
        color: '#f0d8e1'
    },

    horizontalList: {
        paddingRight: 10
    },

    loadingRow: {
        height: 180,
        justifyContent: 'center'
    },

    showCard: {
        width: 190,
        backgroundColor: '#3b3b42',
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 14
    },

    showImage: {
        width: '100%',
        height: 260,
        resizeMode: 'cover'
    },

    showInfoBox: {
        padding: 12
    },

    showName: {
        color: '#fff7fb',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 4
    },

    showInfo: {
        color: '#d9aebb',
        fontSize: 14
    },

    personCard: {
        width: 170,
        backgroundColor: '#3b3b42',
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 14
    },

    personImage: {
        width: '100%',
        height: 220,
        resizeMode: 'cover'
    },

    personInfoBox: {
        padding: 12
    },

    personName: {
        color: '#fff7fb',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4
    },

    personInfo: {
        color: '#d9aebb',
        fontSize: 14
    }
});