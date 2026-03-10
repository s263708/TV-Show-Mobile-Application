import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Keyboard } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SearchForm({setSearchQuery}) {

    const submitHandler = () => {
        Keyboard.dismiss();
        setSearchQuery(text);
    }

    const [text, setText] = useState();

    const changeHandler = (val) => {
        setText(val);
    }

    return (
        <View style={styles.searchForm}>
            <TextInput style={styles.input} placeholder="Search shows..." onChangeText={changeHandler} onSubmitEditing={() => { submitHandler();}}/>
            <Pressable style={styles.searchButton} onPress={() => submitHandler()}>
                <FontAwesome name='search' size={34} color='white'/>
            </Pressable>
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
            color: '#000',
            paddingHorizontal: 8,
            borderWidth: 2,
            borderColor: '#000'
        },

        searchButton: {
            width: 40,
            height: 40,
            padding: 2,
            backgroundColor: '#000',
        },

        icon: {
            flex: 1,
            justifyContent:'center',
            alignSelf:'center',
            lineHeight: 32,
        }
    },
);