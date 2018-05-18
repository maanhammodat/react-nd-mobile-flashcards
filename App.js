import React from 'react';
import { View } from 'react-native';
import { Constants } from 'expo'
import DeckList from './components/DeckList'

export default class App extends React.Component {
  render() {
    return (
      <View>
        <View style={{ height: Constants.statusBarHeight }}></View>
        <DeckList />
      </View>
    );
  }
}