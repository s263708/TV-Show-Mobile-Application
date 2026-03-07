import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ShowsScreen from '../screens/Shows';

export default function ShowsNavigator() {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator style={styles.ShowsNavigator}>
            <Stack.Screen name="Shows" component={ShowsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    ShowsNavigator: {

    },
});