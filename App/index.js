import React, { Component } from 'react';
import {MainScreenNavigatorRouter,Root, Tabs } from './config/router';
import {
  Text,
  View,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
class App extends Component {
  componentDidMount() {
	  // SplashScreen.hide()
  }
  render() {
    return(
	  <MainScreenNavigatorRouter/>
	  )
  }
}
export default App;
