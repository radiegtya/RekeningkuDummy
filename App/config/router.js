import React, { Component } from "react";
import { DrawerNavigator,TabNavigator } from 'react-navigation';
import Home from '../screens/Home';
import History from '../screens/History';
import Orderbook from '../screens/Orderbook';
import Chart from '../screens/Chart';
import Wallet from '../screens/Wallet';
import MyWallet from '../screens/MyWallet';
import DepoWD from '../screens/DepoWD';
import BuySell from '../screens/BuySell';
import BuySellConfirm from '../screens/BuySellConfirm';
import BuySellSuccess from '../screens/BuySellSuccess';
import Login from '../screens/Login';
import OTP from '../screens/OTP';
import Settings from '../screens/Settings';
import SideBar from '../screens/SideBar';
import {
  Button,
  Text,
  Icon,
  Item,
  Footer,
  FooterTab,
  Label
} from "native-base";
export const Tabs = TabNavigator({
  Home:      {  screen: props => <Home  {...props} /> },
  History: {  screen: props => <History {...props} /> },
  Chart: 	 {  screen: props => <Chart {...props} /> },
  Wallet:    {  screen: props => <Wallet {...props} /> },
  },
  {
    tabBarPosition: "bottom",
    tabBarComponent: props => {
      return (
        <Footer>
          <FooterTab>
            <Button
              vertical
              active={props.navigationState.index === 0}
              onPress={() => props.navigation.navigate("Home")}
            >
              <Icon name="swap"/>
            </Button>
            <Button
              vertical
              active={props.navigationState.index === 1}
              onPress={() => props.navigation.navigate("History")}
            >
              <Icon name="trending-up"/>
            </Button>
            <Button
              vertical
              active={props.navigationState.index === 2}
              onPress={() => props.navigation.navigate("Chart")}
            >
              <Icon name="ios-stats"/>
            </Button>
			<Button
              vertical
              active={props.navigationState.index === 3}
              onPress={() => props.navigation.navigate("Wallet")}
            >
              <Icon name="briefcase"/>
            </Button>			
			</FooterTab>
        </Footer>
      );
    }
  }
 );

export const MainScreenNavigatorRouter = DrawerNavigator(
  {
   Tabs: {
    screen: Tabs,
  },
  Login: {
    screen: Login,
  },
  OTP:{
	screen: OTP,
  },
  MyWallet: {
    screen: MyWallet,
  },
  BuySell: {
    screen: BuySell,
  },
  DepoWD: {
    screen: DepoWD,
  },
  Settings: {
    screen: Settings,
  },
  BuySellConfirm: {
    screen: BuySellConfirm,
  },
   BuySellSuccess: {
    screen: BuySellSuccess,
  }
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);


