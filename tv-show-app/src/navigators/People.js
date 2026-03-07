import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import PeopleScreen from '../screens/People';

export default function PeopleNavigator() {

    const Stack = createStackNavigator();
    
    return (
        <Stack.Navigator style={styles.PeopleScreen}>
            <Stack.Screen name="People" component={PeopleScreen} options={{ headerShown: false }}/>
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    PeopleNavigator: {

    },
});