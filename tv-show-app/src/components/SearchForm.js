import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Keyboard } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SearchForm({ setSearchQuery, type, openFilter }) {

    const [text, setText] = useState('');

    const submitHandler = () => {
        Keyboard.dismiss();
        setSearchQuery(text);
    };

    return (
        <View style={styles.searchForm}>
            <TextInput
                style={styles.input}
                placeholder={"Search " + (type ? type : "shows") + "..."}
                onChangeText={setText}
                onSubmitEditing={submitHandler}
            />

            <Pressable style={styles.searchButton} onPress={submitHandler}>
                <FontAwesome name='search' size={24} color='white'/>
            </Pressable>

            {/* Only show filter button if openFilter exists */}
            {openFilter && (
                <Pressable style={styles.filterButton} onPress={openFilter}>
                    <FontAwesome name='filter' size={22} color='white'/>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({

    searchForm: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#FFF'
    },

    input: {
        flexGrow: 1,
        paddingHorizontal: 8,
        borderWidth: 2,
        borderColor: '#000'
    },

    searchButton: {
        width: 40,
        height: 40,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    },

    filterButton: {
        width: 40,
        height: 40,
        backgroundColor: '#444',
        justifyContent: 'center',
        alignItems: 'center'
    }

});