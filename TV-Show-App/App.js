import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeNavigator from './src/navigators/Home';
import ShowsNavigator from './src/navigators/Shows';
import PeopleNavigator from './src/navigators/People';

export default function App() {

  const Drawer = createDrawerNavigator();

  return (
    <SafeAreaProvider>
      <NavigationContainer style={styles.container}>
        <Drawer.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2f2f34'
            },
            headerTintColor: '#fff7fb',
            drawerStyle: {
              backgroundColor: '#2f2f34'
            },
            drawerActiveBackgroundColor: '#d9aebb',
            drawerActiveTintColor: '#2f2f34',
            drawerInactiveTintColor: '#fff7fb',
            sceneContainerStyle: {
              backgroundColor: '#2f2f34'
            }
          }}
        >
          <Drawer.Screen
            name="Home"
            component={HomeNavigator}
            options={{ title: 'Home' }}
          />
          <Drawer.Screen
            name="Shows"
            component={ShowsNavigator}
            options={{ title: 'Shows' }}
          />
          <Drawer.Screen
            name="People"
            component={PeopleNavigator}
            options={{ title: 'People' }}
          />
        </Drawer.Navigator>
        <StatusBar style="light" hidden={false} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({

});