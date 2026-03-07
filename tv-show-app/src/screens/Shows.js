import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { global } from '../config/global';

export default function ShowsScreen({ navigation }) {

  const [searchQuery, setSearchQuery] = useState('Batman');

  const [shows, setShows] = useState();

  const searchShows = () => {
    console.log("Make a call to the API using the search query: " + searchQuery);

    fetch('https://api.tvmaze.com/search/shows?q=' + searchQuery)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setShows(json);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    searchShows();
  }, [searchQuery])

  return (
    <View style={styles.ShowsScreen}>
      <Text>TV Shows screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ShowsScreen: {

  },
});