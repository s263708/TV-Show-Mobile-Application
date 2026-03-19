import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Keyboard } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SearchForm({ setSearchQuery, type, openFilter }) {

    const [text, setText] = useState('');

    const submitHandler = () => {
        Keyboard.dismiss();

        if(text && text.trim() !== ''){
            setSearchQuery(text);
        }
    };

    return (
        <View style={styles.searchForm}>
            <TextInput
                style={styles.input}
                placeholder={"Search " + (type ? type : "shows") + "..."}
                placeholderTextColor="#d3c5cb"
                onChangeText={setText}
                onSubmitEditing={submitHandler}
                value={text}
            />

            <Pressable style={styles.searchButton} onPress={submitHandler}>
                <FontAwesome name='search' size={24} color='white'/>
            </Pressable>

            {openFilter && (
                <Pressable style={styles.filterButton} onPress={openFilter}>
                    <FontAwesome name='filter' size={22} color='#2f2f34'/>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({

    searchForm: {
        width: '100%',
        minHeight: 52,
        flexDirection: 'row',
        backgroundColor: '#2f2f34',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 6
    },

    input: {
        flexGrow: 1,
        paddingHorizontal: 12,
        borderWidth: 1.5,
        borderColor: '#d9aebb',
        backgroundColor: '#3b3b42',
        borderRadius: 10,
        color: '#fff7fb',
        marginRight: 8
    },

    searchButton: {
        width: 44,
        height: 44,
        backgroundColor: '#d9aebb',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },

    filterButton: {
        width: 44,
        height: 44,
        backgroundColor: '#f0d8e1',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 8
    }

});