import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, Linking, ScrollView, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShowDetailsScreen({ route, navigation }) {

    const [showData, setShowData] = useState();

    const [castData, setCastData] = useState();

    const [episodeData, setEpisodeData] = useState();

    const [selectedSeason, setSelectedSeason] = useState();

    const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);

    const { showId } = route.params;

    const { width, height } = useWindowDimensions();
    
    const isLandscape = width > height;

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

    const getEpisodeData = () => {
        fetch('https://api.tvmaze.com/shows/' + showId + '/episodes')
        .then((response) => response.json())
        .then((json) => {
            setEpisodeData(json);

            const seasons = [...new Set(json.map((episode) => episode.season))];

            if (seasons.length > 0) {
                setSelectedSeason(seasons[0]);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    };

    useEffect(() => {
        getShowData();
        getCastData();
        getEpisodeData();
    }, [showId]);

    const groupedEpisodes = episodeData ? episodeData.reduce((groups, episode) => {
        const seasonNumber = episode.season;

        if (!groups[seasonNumber]) {
            groups[seasonNumber] = [];
        }

        groups[seasonNumber].push(episode);
        return groups;
    }, {}) : {};

    const seasonNumbers = episodeData
        ? [...new Set(episodeData.map((episode) => episode.season))]
        : [];

    const selectedSeasonEpisodes = selectedSeason && groupedEpisodes[selectedSeason]
        ? groupedEpisodes[selectedSeason]
        : [];

    return (
        <SafeAreaView style={styles.ShowDetailsScreen} edges={['left', 'right', 'bottom']}>
            {showData ? (
                <ScrollView style={styles.detailsContainer} contentContainerStyle={{ paddingBottom: 25 }}>
                    <View style={[styles.topSection, isLandscape && styles.topSectionLandscape]}>
                        <Image
                            style={[styles.showImage, isLandscape && styles.showImageLandscape]}
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
                            <Text style={styles.metaDataText}>
                                <Text style={{ fontWeight: 'bold' }}>Status:</Text> {showData.status ? showData.status : 'N/A'}
                            </Text>
                            <Text style={styles.metaDataText}>
                                <Text style={{ fontWeight: 'bold' }}>Episodes:</Text> {episodeData ? episodeData.length : 'Loading...'}
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
                    </View>

                    <View style={styles.episodesContainer}>
                        <Text style={styles.episodesHeading}>Episodes by Season</Text>

                        {episodeData ? (
                            <View>
                                <Pressable
                                    style={styles.dropdownButton}
                                    onPress={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                                >
                                    <Text style={styles.dropdownButtonText}>
                                        {selectedSeason ? 'Season ' + selectedSeason : 'Select Season'}
                                    </Text>
                                    <Text style={styles.dropdownArrow}>
                                        {seasonDropdownOpen ? '▲' : '▼'}
                                    </Text>
                                </Pressable>

                                {seasonDropdownOpen && (
                                    <View style={styles.dropdownMenu}>
                                        {seasonNumbers.map((season) => (
                                            <Pressable
                                                key={season}
                                                style={[
                                                    styles.dropdownItem,
                                                    selectedSeason === season && styles.dropdownItemSelected
                                                ]}
                                                onPress={() => {
                                                    setSelectedSeason(season);
                                                    setSeasonDropdownOpen(false);
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        styles.dropdownItemText,
                                                        selectedSeason === season && styles.dropdownItemTextSelected
                                                    ]}
                                                >
                                                    Season {season}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                )}

                                <View style={styles.selectedSeasonContainer}>
                                    <Text style={styles.selectedSeasonHeading}>
                                        {selectedSeason ? 'Season ' + selectedSeason : 'Episodes'}
                                    </Text>

                                    {selectedSeasonEpisodes.length > 0 ? (
                                        selectedSeasonEpisodes.map((episode) => (
                                            <View key={episode.id} style={styles.episodeRow}>
                                                <Text style={styles.episodeText}>
                                                    Episode {episode.number}: {episode.name}
                                                </Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text style={styles.metaDataText}>No episodes found for this season</Text>
                                    )}
                                </View>
                            </View>
                        ) : (
                            <Text style={styles.metaDataText}>Loading episodes...</Text>
                        )}
                    </View>

                    <View style={styles.castContainer}>
                        <Text style={styles.castHeading}>Cast</Text>

                        {castData && castData.length > 0 ? (
                            <FlatList
                                data={castData}
                                scrollEnabled={false}
                                numColumns={isLandscape ? 3 : 2}
                                key={isLandscape ? 'landscape' : 'portrait'}
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
                                                <Text style={styles.noCastImageText}>No Preview</Text>
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
                    <ActivityIndicator size="large" color="#d9aebb"/>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    ShowDetailsScreen: {
        flex: 1,
        backgroundColor: '#2f2f34',
    },

    detailsContainer: {
    },

    topSection: {
    },

    topSectionLandscape: {
        flexDirection: 'row'
    },

    loadingContainer: {
        height: '100%',
        justifyContent: 'center',
    },

    showImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        backgroundColor: '#3b3b42'
    },

    showImageLandscape: {
        width: '45%',
        height: 360
    },

    metaDataContainer: {
        margin: 20,
        flex: 1
    },

    metaDataText: {
        fontSize: 17,
        marginBottom: 8,
        color: '#fff7fb'
    },

    episodesContainer: {
        marginHorizontal: 20,
        marginBottom: 25,
        backgroundColor: '#3b3b42',
        borderRadius: 12,
        padding: 14
    },

    episodesHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff7fb',
        marginBottom: 12
    },

    dropdownButton: {
        backgroundColor: '#d9aebb',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },

    dropdownButtonText: {
        color: '#2f2f34',
        fontSize: 16,
        fontWeight: 'bold'
    },

    dropdownArrow: {
        color: '#2f2f34',
        fontSize: 14,
        fontWeight: 'bold'
    },

    dropdownMenu: {
        backgroundColor: '#2f2f34',
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#d9aebb'
    },

    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#3b3b42'
    },

    dropdownItemSelected: {
        backgroundColor: '#d9aebb'
    },

    dropdownItemText: {
        color: '#fff7fb',
        fontSize: 15
    },

    dropdownItemTextSelected: {
        color: '#2f2f34',
        fontWeight: 'bold'
    },

    selectedSeasonContainer: {
        marginTop: 4
    },

    selectedSeasonHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#d9aebb',
        marginBottom: 10
    },

    episodeRow: {
        backgroundColor: '#2f2f34',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginBottom: 8
    },

    episodeText: {
        color: '#fff7fb',
        fontSize: 15
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
        color: '#fff7fb'
    },

    castItem: {
        flex: 1,
        margin: 10,
        minHeight: 260,
        backgroundColor: '#3b3b42',
        borderRadius: 12,
        padding: 8
    },

    castImage: {
        width: '100%',
        height: 200,
        borderRadius: 10
    },

    noCastImage: {
        backgroundColor: '#d9aebb',
        height: 200,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },

    noCastImageText: {
        color: '#2f2f34',
        fontWeight: '600'
    },

    castName: {
        marginTop: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#fff7fb'
    },

    characterName: {
        textAlign: 'center',
        color: '#f0d8e1'
    },
});