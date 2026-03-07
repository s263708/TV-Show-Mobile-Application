import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function HomeScreen({ navigation }) {

    return (
        <View style={styles.HomeScreen}>
            <Pressable onPress={() => navigation.navigate('Shows')}>
                <Text>Browse Shows</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('People')}>
                <Text>Browse People</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    HomeScreen: {
        padding: 20,
    },
});