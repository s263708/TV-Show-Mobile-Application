import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, Pressable, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchForm from '../components/SearchForm';
import Filter from '../components/Filter';

export default function ShowsScreen({ navigation }) {

  const [searchQuery, setSearchQuery] = useState('a');

  const [shows, setShows] = useState();

  const [genres, setGenres] = useState([]);

  const [selectedGenres, setSelectedGenres] = useState([]);

  const [filterOpen, setFilterOpen] = useState(false);

  const { width, height } = useWindowDimensions();
  
  const isLandscape = width > height;

  const searchShows = () => {
    console.log("Make a call to the API using the search query: " + searchQuery);

    fetch('https://api.tvmaze.com/search/shows?q=' + searchQuery)
      .then((response) => response.json())
      .then((json) => {

        setShows(json);

        const genreSet = new Set();

        json.forEach(item => {
          item.show.genres.forEach(g => genreSet.add(g));
        });

        setGenres([...genreSet]);

        setSelectedGenres([]);

      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    searchShows();
  }, [searchQuery]);

  const filteredShows = shows?.filter((item) => {

    if (selectedGenres.length === 0) return true;

    return selectedGenres.some(genre =>
      item.show.genres.includes(genre)
    );

  });

  return (
    <SafeAreaView style={styles.ShowsScreen} edges={['left', 'right', 'bottom']}>

      <SearchForm type="shows" setSearchQuery={setSearchQuery} openFilter={() => setFilterOpen(!filterOpen)}/>

      {filterOpen && (
        <Filter genres={genres} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres}/>
      )}

      {filteredShows && filteredShows.length > 0 ? (
        <View style={styles.resultsContainer}>
          <FlatList
            key={isLandscape ? 'landscape' : 'portrait'}
            numColumns={isLandscape ? 3 : 2}
            contentContainerStyle={styles.listContent}
            data={filteredShows}
            keyExtractor={(item) => item.show.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.resultItem}>
                <Pressable
                  style={styles.resultImageTouchable}
                  onPress={() => {
                    navigation.navigate('Show Details', {
                      showId: item.show.id,
                    });
                  }}
                >
                  <Image
                    style={styles.resultImage}
                    source={{
                      uri: item.show.image
                        ? item.show.image.medium
                        : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
                    }}
                    resizeMode="cover"
                  />
                </Pressable>
                <Text style={styles.resultText}>{item.show.name}</Text>
              </View>
            )}
          />
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d9aebb"/>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ShowsScreen: {
    flex: 1,
    backgroundColor: '#2f2f34',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  resultsContainer: {
    flex: 1,
  },

  listContent: {
    padding: 10,
    paddingBottom: 25
  },

  resultItem: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
    backgroundColor: '#3b3b42',
    borderRadius: 12,
    padding: 8
  },

  resultImageTouchable: {
    width: '100%',
  },

  resultImage: {
    width: '100%',
    height: 250,
    borderRadius: 10
  },

  resultText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#fff7fb',
    fontWeight: '600'
  },
});