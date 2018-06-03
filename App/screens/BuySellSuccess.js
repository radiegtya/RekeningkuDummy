import React, { Component } from "react";
import { 
  Platform,View } from "react-native";
import { Col, Row, Grid } from 'react-native-easy-grid';
import {
   Container,
   Header,
   styles, 
   Input,
   InputGroup, 
   Title,
   Label, 
   List,
   Separator, 
   ListItem, 
   Content, 
   Button, 
   Icon, 
   Text, 
   Right, 
   Body, 
   Left, 
   Form, Footer,FooterTab,
   } from "native-base";
export default class Trade extends Component {

  render() {
    return (
      <Container>
        <Header>
        <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('BuySell')}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Sukses</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={{backgroundColor:'#fff'}}>
		<Form style={{flex:1}}>
            <Grid style={{paddingLeft:8,paddingTop:25,paddingBottom:5}}>
            <Col>
                 <Text style={{fontSize:22}}><Icon name="cart" style={{fontSize:22,marginRight:20}}/> {this.props.navigation.state.params.status} {this.props.navigation.state.params.code} Sukses.</Text>
            </Col>
            </Grid>
            <Grid style={{paddingLeft:8,paddingTop:35,paddingBottom:5}}>
            <Col>
                 <Text>Estimasi Terima Dana {this.props.navigation.state.params.estimasi}</Text>
            </Col>
			</Grid>
          </Form>      
        </Content>
        <Footer>
          <FooterTab>
			<Button  horizontal
			onPress={() => this.props.navigation.navigate('Home')}><Icon name="paper-plane" /><Text>Selesai</Text></Button>
		  </FooterTab>	
		</Footer>
      </Container>
    )
  }
}           