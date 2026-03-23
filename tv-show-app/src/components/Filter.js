import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function Filter({ genres, selectedGenres, setSelectedGenres }) {

    return (
        <View style={styles.container}>
            {genres.map((genre) => {
                const isSelected = selectedGenres.includes(genre); // check if this genre is currently selected

                return (
                    <Pressable
                        key={genre}
                        style={[styles.genreButton, isSelected && styles.selectedGenreButton]}
                        onPress={() =>
                            // toggle genre in selected list (add/remove)
                            setSelectedGenres(prev =>
                                prev.includes(genre)
                                    ? prev.filter(g => g !== genre)
                                    : [...prev, genre]
                            )
                        }
                    >
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
        paddingHorizontal: 10,
        paddingBottom: 8,
        backgroundColor: '#000'
    },

    genreButton: {
        padding: 8,
        margin: 5,
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#d9aebb',
        borderRadius: 8
    },

    selectedGenreButton: {
        backgroundColor: '#d9aebb',
        borderColor: '#d9aebb'
    },

    genreText: {
        color: '#fff7fb'
    },

    selectedGenreText: {
        color: '#000',
        fontWeight: 'bold'
    }
});