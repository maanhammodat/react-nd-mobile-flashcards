import React from 'react';
import { View } from 'react-native';
import { Constants } from 'expo'
import DeckList from './components/DeckList';
import Deck from './components/Deck';
import { createStackNavigator } from 'react-navigation';

// export default class App extends React.Component {
//   render() {
//     return (
//       <View>
//         <View style={{ height: Constants.statusBarHeight }}></View>
//         <DeckList />
//       </View>
//     );
//   }
// }

const RootStack = createStackNavigator(
  {
    Home: DeckList,
    Deck: Deck
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, height: Constants.statusBarHeight }}>
        <RootStack />
      </View>
    )
  }
}