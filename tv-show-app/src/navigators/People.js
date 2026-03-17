import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PeopleScreen from '../screens/People';
import PeopleDetailsScreen from '../screens/PeopleDetails';
import ShowDetailsScreen from '../screens/ShowDetails';

const Stack = createStackNavigator();

export default function PeopleNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="People"
                component={PeopleScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="People Details"
                component={PeopleDetailsScreen}
            />
            <Stack.Screen
                name="Show Details"
                component={ShowDetailsScreen}
            />
        </Stack.Navigator>
    );
}