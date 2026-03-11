import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function Filter({ genres, selectedGenres, setSelectedGenres }) {

    return (
        <View style={styles.container}>
            {genres.map((genre) => {
                const isSelected = selectedGenres.includes(genre);

                return (
                    <Pressable key={genre} style={[styles.genreButton, isSelected && styles.selectedGenreButton]} onPress={() =>
                            setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre])}>

                        <Text style={[styles.genreText, isSelected && styles.selectedGenreText]}>
                            {genre}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10
    },

    genreButton: {
        padding: 8,
        margin: 5,
        backgroundColor: '#ddd',
        borderWidth: 1,
        borderColor: '#999'
    },

    selectedGenreButton: {
        backgroundColor: '#000',
        borderColor: '#000'
    },

    genreText: {
        color: '#000'
    },

    selectedGenreText: {
        color: '#fff',
        fontWeight: 'bold'
    }
});