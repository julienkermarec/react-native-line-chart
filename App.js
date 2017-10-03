import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

import HomeScreen from './screens/HomeScreen';



  const MainScreenNavigator = StackNavigator({
      Home: { screen: HomeScreen }
    });

  export default class App extends React.Component {
    render() {
      return (
          <MainScreenNavigator />
      );
    }
  }
