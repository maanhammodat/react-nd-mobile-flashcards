import React from 'react';
import { Text, View } from 'react-native';
import { Constants } from 'expo';
import { AppProvider } from './components/provider';
import DeckListContainer from './components/DeckListContainer';
import Deck from './components/Deck';
import { createStackNavigator } from 'react-navigation';


// export default class App extends React.Component {
//   render() {
//     return (
//       <AppProvider>
//         <Test/>
//       </AppProvider>
//     )
//   }
// }

const RootStack = createStackNavigator(
  {
    Home: DeckListContainer,
    Deck: Deck
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return (
      <AppProvider>
        <RootStack />
      </AppProvider>
    )
  }
}