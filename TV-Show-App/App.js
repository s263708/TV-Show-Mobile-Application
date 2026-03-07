import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeNavigator from './src/navigators/Home';
import ShowsNavigator from './src/navigators/Shows';
import PeopleNavigator from './src/navigators/People';

export default function App() {

  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer style={styles.container}>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeNavigator} options={{ title: 'Photo Lens' }} />
        <Drawer.Screen name="Shows" component={ShowsNavigator} options={{ title: 'Shows' }} />
        <Drawer.Screen name="People" component={PeopleNavigator} options={{ title: 'People' }} />
      </Drawer.Navigator>
      <StatusBar style="auto" hidden={true} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});
