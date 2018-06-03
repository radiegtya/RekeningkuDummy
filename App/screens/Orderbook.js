import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableHighlight,  
} from 'react-native';
import {
  Button,
  Text,
  Container,
  Card,
  CardItem,
  Body,
  Content,
  Header,
  Title,
  Left,
  Icon,
  Right
} from "native-base";

class Orderbook extends Component {
 render() {
	return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Order Book</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{backgroundColor:'#fff'}}>
        <Text>
          Coming Soon
        </Text>
        </Content>
		</Container> 
    );
  }
}
export default Orderbook;
