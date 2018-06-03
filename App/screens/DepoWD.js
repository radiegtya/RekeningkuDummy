import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Image,
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

class DepoWD extends Component {
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
            <Title>Deposit/Witdraw</Title>
          </Body>
          <Right />
        </Header>
        <View style={[styles.container, styles.horizontal]}>
		<Image source={require('../../images/coming-soon.png')} style={styles.imgcenter} />
		</View>
		</Container> 
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
	alignItems: 'center'
  },
  imgcenter:{
	  width:200,
	  height:200,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})
export default DepoWD;
