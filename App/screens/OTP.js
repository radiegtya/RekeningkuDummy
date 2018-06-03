import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView
} from 'react-native';
import {
  Button,
  Container,
  Form,
  Right,
  Item,
  Body,
  Title,
  Icon,
  Left,
  Text,
  Content,
  Header,
  Input,	
} from "native-base";
import Cookie from 'react-native-cookie';
class OTP extends Component {
 constructor (props) {
     super(props);
      this.state={
         otp:''
      }
      this.login = this.login.bind(this); 
 }	
 login() {
   var otp=this.state.otp;
   var loginAPI="https://beta.rekeningku.com/id/authmob";
   	const cookie=Cookie.get('https://beta.rekeningku.com/','mobtokenauth').then((res)=>{
	if (res!=null){
		fetch(loginAPI, {
			method: 'POST',
			headers: new Headers({
             'Content-Type': 'application/x-www-form-urlencoded',
			}),
			body: "token="+res+"&otp="+otp
		})
		.then((response) => response.json())
		.then((responseJson) => {
			var json=responseJson;
			if (typeof json.error!="undefined"){
				alert(json.error);
			}else{
				Cookie.set('https://beta.rekeningku.com/', 'mobtoken', json.token, {
				path: '/',
				domain: 'rekeningku.com'
				}).then(() => console.log('success'));
				Cookie.set('https://beta.rekeningku.com/', 'mobfname', json.fname, {
				path: '/',
				domain: 'rekeningku.com'
				}).then(() => console.log('success'));
				Cookie.set('https://beta.rekeningku.com/', 'mobemail', json.email, {
				path: '/',
				domain: 'rekeningku.com'
				}).then(() => console.log('success'));
				this.props.navigation.navigate('Home');
			}
		});
		}
	})
	.catch((error) => {
		console.error(error);
	});
 }	
 render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('Home')}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Authenticator</Title>
          </Body>
          <Right />
        </Header>
		<Content style={{backgroundColor:'#fff'}}>
			<Form>
				<Item style={{padding:20}}>
					<Icon name='lock' />
					<Input keyboardType='numeric' placeholder="Kode Authenticator" onChangeText={(otp) => {
					this.setState({otp})}} secureTextEntry={true} />
				</Item>
			</Form>
		</Content>
		<View style={{ flexDirection: "row", flex: 1, position: "absolute", bottom: 0, left: 0, right: 0, justifyContent: 'space-between', padding: 15 }}>
		<Button style={{width:150}} iconLeft danger large onPress={() => this.props.navigation.navigate('Home')}><Icon name="close" /><Text> Batal </Text></Button>
		<Button style={{width:150}} iconLeft primary large onPress={() => this.login()}><Icon name="unlock" /><Text> Login </Text></Button>
		</View>
	</Container>

    );
  }
}

export default OTP;
