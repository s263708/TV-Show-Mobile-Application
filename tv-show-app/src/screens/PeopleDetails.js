import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, Linking, ScrollView, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PeopleDetailsScreen({ route, navigation }) {

    const [personData, setPersonData] = useState();

    const [castCredits, setCastCredits] = useState();

    const [crewCredits, setCrewCredits] = useState();

    const [selectedCreditType, setSelectedCreditType] = useState();

    const [creditDropdownOpen, setCreditDropdownOpen] = useState(false);

    const { personId } = route.params;

    const { width, height } = useWindowDimensions();

    const isLandscape = width > height;

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

    const getCrewCredits = () => {
        fetch('https://api.tvmaze.com/people/' + personId + '/crewcredits?embed=show')
        .then((response) => response.json())
        .then((json) => {
            setCrewCredits(json);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    useEffect(() => {
        getPersonData();
        getCastCredits();
        getCrewCredits();
    }, [personId]);

    const personRoles = [];

    if (castCredits && castCredits.length > 0) {
        personRoles.push('Actor');
    }

    if (crewCredits && crewCredits.length > 0) {
        const crewTypes = [...new Set(
            crewCredits
                .map((item) => item.type)
                .filter((type) => type && type.trim() !== '' && (type === 'Director' || type === 'Producer'))
        )];

        personRoles.push(...crewTypes);
    }

    const actorShows = castCredits
        ? [...new Map(
            castCredits
                .filter((item) => item._embedded && item._embedded.show)
                .map((item) => [item._embedded.show.id, item._embedded.show])
          ).values()]
        : [];

    const directedShows = crewCredits
        ? [...new Map(
            crewCredits
                .filter((item) => item.type === 'Director' && item._embedded && item._embedded.show)
                .map((item) => [item._embedded.show.id, item._embedded.show])
          ).values()]
        : [];

    const producedShows = crewCredits
        ? [...new Map(
            crewCredits
                .filter((item) => item.type === 'Producer' && item._embedded && item._embedded.show)
                .map((item) => [item._embedded.show.id, item._embedded.show])
          ).values()]
        : [];

    const availableCreditTypes = [];

    if (actorShows.length > 0) {
        availableCreditTypes.push('Actor');
    }

    if (directedShows.length > 0) {
        availableCreditTypes.push('Director');
    }

    if (producedShows.length > 0) {
        availableCreditTypes.push('Producer');
    }

    useEffect(() => {
        if (!selectedCreditType && availableCreditTypes.length > 0) {
            setSelectedCreditType(availableCreditTypes[0]);
        }
    }, [castCredits, crewCredits]);

    let selectedShows = [];

    if (selectedCreditType === 'Actor') {
        selectedShows = actorShows;
    } else if (selectedCreditType === 'Director') {
        selectedShows = directedShows;
    } else if (selectedCreditType === 'Producer') {
        selectedShows = producedShows;
    }

    const getSectionHeading = () => {
        if (selectedCreditType === 'Actor') {
            return 'Starred in';
        }

        if (selectedCreditType === 'Director') {
            return 'Directed';
        }

        if (selectedCreditType === 'Producer') {
            return 'Produced';
        }

        return 'Credits';
    };

    return (
        <SafeAreaView style={styles.PeopleDetailsScreen} edges={['left', 'right', 'bottom']}>
            {personData ? (
                <ScrollView style={styles.detailsContainer} contentContainerStyle={{ paddingBottom: 25 }}>
                    <View style={[styles.topSection, isLandscape && styles.topSectionLandscape]}>
                        {personData.image ? (
                            <Image
                                style={[styles.personImage, isLandscape && styles.personImageLandscape]}
                                source={{ uri: personData.image.original }}
                            />
                        ) : (
                            <View style={[styles.noImage, isLandscape && styles.personImageLandscape]}>
                                <Text style={styles.noImageText}>No Preview</Text>
                            </View>
                        )}

                        <View style={styles.metaDataContainer}>
                            <Text style={styles.metaDataText}>
                                <Text style={{ fontWeight: 'bold' }}>Name:</Text> {personData.name}
                            </Text>
                            <Text style={styles.metaDataText}>
                                <Text style={{ fontWeight: 'bold' }}>Roles:</Text> {personRoles.length > 0 ? personRoles.join(', ') : 'N/A'}
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
                    </View>

                    <View style={styles.creditsContainer}>
                        <Text style={styles.creditsHeading}>TV Credits</Text>

                        {availableCreditTypes.length > 0 ? (
                            <View>
                                <Pressable
                                    style={styles.dropdownButton}
                                    onPress={() => setCreditDropdownOpen(!creditDropdownOpen)}
                                >
                                    <Text style={styles.dropdownButtonText}>
                                        {selectedCreditType ? getSectionHeading() : 'Select Credit Type'}
                                    </Text>
                                    <Text style={styles.dropdownArrow}>
                                        {creditDropdownOpen ? '▲' : '▼'}
                                    </Text>
                                </Pressable>

                                {creditDropdownOpen && (
                                    <View style={styles.dropdownMenu}>
                                        {availableCreditTypes.map((type) => (
                                            <Pressable
                                                key={type}
                                                style={[
                                                    styles.dropdownItem,
                                                    selectedCreditType === type && styles.dropdownItemSelected
                                                ]}
                                                onPress={() => {
                                                    setSelectedCreditType(type);
                                                    setCreditDropdownOpen(false);
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        styles.dropdownItemText,
                                                        selectedCreditType === type && styles.dropdownItemTextSelected
                                                    ]}
                                                >
                                                    {type === 'Actor' ? 'Starred in' : type === 'Director' ? 'Directed' : 'Produced'}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                )}

                                <View style={styles.selectedCreditContainer}>
                                    <Text style={styles.selectedCreditHeading}>{getSectionHeading()}</Text>

                                    {selectedShows.length > 0 ? (
                                        <FlatList
                                            data={selectedShows}
                                            scrollEnabled={false}
                                            keyExtractor={(item) => item.id.toString()}
                                            numColumns={isLandscape ? 3 : 2}
                                            key={(isLandscape ? 'landscape' : 'portrait') + '-' + selectedCreditType}
                                            renderItem={({ item }) => (
                                                <Pressable
                                                    style={styles.resultImagePressable}
                                                    onPress={() => {
                                                        navigation.navigate('Show Details', {
                                                            showId: item.id,
                                                        });
                                                    }}
                                                >
                                                    {item.image ? (
                                                        <Image
                                                            style={styles.resultImage}
                                                            source={{ uri: item.image.medium }}
                                                        />
                                                    ) : (
                                                        <View style={styles.showNoImage}>
                                                            <Text style={styles.showNoImageText}>No Preview</Text>
                                                        </View>
                                                    )}
                                                    <Text style={styles.resultText}>{item.name}</Text>
                                                </Pressable>
                                            )}
                                        />
                                    ) : (
                                        <Text style={styles.metaDataText}>No TV credits found</Text>
                                    )}
                                </View>
                            </View>
                        ) : (
                            <Text style={styles.metaDataText}>No TV credits found</Text>
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
    PeopleDetailsScreen: {
        flex: 1,
        backgroundColor: '#000',
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

    personImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        backgroundColor: '#111'
    },

    personImageLandscape: {
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

    creditsContainer: {
        marginHorizontal: 20,
        marginBottom: 25,
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 14
    },

    creditsHeading: {
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
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold'
    },

    dropdownArrow: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold'
    },

    dropdownMenu: {
        backgroundColor: '#000',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderWidth: 1,
        borderColor: '#d9aebb',
        marginBottom: 12
    },

    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#111'
    },

    dropdownItemSelected: {
        backgroundColor: '#d9aebb'
    },

    dropdownItemText: {
        color: '#fff7fb',
        fontSize: 15
    },

    dropdownItemTextSelected: {
        color: '#000',
        fontWeight: 'bold'
    },

    selectedCreditContainer: {
        marginTop: 4
    },

    selectedCreditHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#d9aebb',
        marginBottom: 10
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
        backgroundColor: '#000',
        borderRadius: 12,
        padding: 8
    },

    resultText: {
        marginTop: 5,
        textAlign: 'center',
        color: '#fff7fb',
        fontWeight: '600'
    },

    showNoImage: {
        backgroundColor: '#d9aebb',
        height: 200,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },

    showNoImageText: {
        color: '#000',
        fontWeight: '600'
    },

    noImage: {
        backgroundColor: '#d9aebb',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center'
    },

    noImageText: {
        color: '#000',
        fontWeight: '600'
    }
});