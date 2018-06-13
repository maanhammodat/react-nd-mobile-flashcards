import React from 'react';
import { AppProvider } from './components/Provider';
import LogoTitle from './components/LogoTitle';
import DeckListContainer from './components/DeckListContainer';
import Deck from './components/Deck';
import Quiz from './components/Quiz';
import { createStackNavigator } from 'react-navigation';
import { setLocalNotification } from './utils/notification';

Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);

const RootStack = createStackNavigator(
  {
    Home: DeckListContainer,
    Deck: Deck,
    Quiz: Quiz
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      headerTitle: <LogoTitle />,
      headerStyle: {
        backgroundColor: '#2d32cc',
      },
      headerTitleStyle: {
        color: '#fff',
      },
      headerTintColor: '#fff'
    }
  }
);

export default class App extends React.Component {
  
  componentDidMount(){
    setLocalNotification();
  }

  render() {
    return (
      <AppProvider>
        <RootStack />
      </AppProvider>
    )
  }
}