import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ShowsScreen from '../screens/Shows';
import ShowDetailsScreen from '../screens/ShowDetails';
import PeopleDetailsScreen from '../screens/PeopleDetails';

const Stack = createStackNavigator();

export default function ShowsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2f2f34'
        },
        headerTintColor: '#fff7fb',
        headerTitleStyle: {
          color: '#fff7fb'
        },
        cardStyle: {
          backgroundColor: '#2f2f34'
        }
      }}
    >
      <Stack.Screen
        name="Shows"
        component={ShowsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Show Details"
        component={ShowDetailsScreen}
      />
      <Stack.Screen
        name="People Details"
        component={PeopleDetailsScreen}
      />
    </Stack.Navigator>
  );
}