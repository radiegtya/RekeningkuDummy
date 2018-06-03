import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  AsyncStorage
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
  Footer,
  FooterTab,
  Header,
  Input,	
} from "native-base";
class Login extends Component {
 constructor (props) {
     super(props);
      this.state={
         email:'',
         password:''
      }
      this.login = this.login.bind(this); 
 }	
 login() {
   var email=this.state.email;
   var password=this.state.password;
   var loginAPI="https://beta.rekeningku.com/id/signmein/";
   fetch(loginAPI, {
		method: 'POST',
		headers: new Headers({
             'Content-Type': 'application/x-www-form-urlencoded',
		}),
		body: "email="+email+"&password="+password
	})
	.then((response) => response.json())
		.then((responseJson) => {
			var json=responseJson;
			if (json.error>0){
				alert(json.message);
			}else{
				if (json.status==1){
					if (json.authtype==2){
						AsyncStorage.multiSet([
						 ['mobtokenauth', json.token]
						]);
						this.props.navigation.navigate('OTP');
					}else{
						AsyncStorage.multiSet([['mobtoken',json.token.toString()],['datetime',json.datetime.toString()],['fname',json.fname.toString()],['email',json.email.toString()]]);
						this.props.navigation.state.params.setlogin(json.token.toString(),json.datetime.toString(),json.fname.toString(),json.email.toString()); 
						this.props.navigation.navigate('Home');
					}
				}
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
            <Title>Login</Title>
          </Body>
          <Right />
        </Header>
		<Content style={{backgroundColor:'#fff'}}>
			<Form>
				<Item style={{padding:20}}>
					<Icon active name='person' />
					<Input placeholder="Email" onChangeText={(email) => {
		this.setState({email})}} />
				</Item>
				<Item style={{padding:20}}>
					<Icon name='lock' />
					<Input placeholder="Password" onChangeText={(password) => {
		this.setState({password})}} secureTextEntry={true} />
				</Item>
			</Form>
		</Content>
		<Footer>
          <FooterTab>
			<Button iconLeft light onPress={() => this.login()}><Text style={{fontSize:16}}> Login </Text></Button>
		  </FooterTab>	
		</Footer>
	</Container>

    );
  }
}

export default Login;
