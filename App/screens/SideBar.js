import React from "react";
import { AppRegistry, AsyncStorage,BackHandler,Alert,Image, StatusBar } from "react-native";
import {
  Button,
  Text,
  Container,
  List,
  ListItem,
  Content,
  Icon
} from "native-base";
import Cookie from 'react-native-cookie';
const routes = ["Bid/Ask", "Order Book", "Chart", "Wallet"];
const page = ["Home", "Orderbook", "Chart", "Wallet",""];
export default class SideBar extends React.Component {
 constructor(	props) {
    super(props);
	this.state = {token:false,datetime:'',fname:'',email:''};
	this.logout = this.login.bind(this); 
	this.exit = this.exit.bind(this); 
 }	
  componentWillMount() {
	var token;
	var datetime;
	var email;
	var fname;
	var result;
	AsyncStorage.multiGet(['mobtoken','datetime','fname','email']).then((data)=>{
		token=data[0][1] || null;
		if (token!=null){
			datetime=data[1][1] || null;
			fname=data[2][1] || null;
			email=data[3][1] || null;
			this.setState({
				token:token,
				datetime:datetime,
				fname:fname,
				email:email
			});
		}
	})
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
  }
  componentWillUnmount() {
   BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
  }
  exit(){
	 Alert.alert(
		'Keluar',
		'Apakah Anda yakin untuk keluar?',
		[
			{text: 'Batal', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'Yakin', onPress: () => {BackHandler.exitApp()}},
		],
		{ cancelable: false }
		) 
  }
  setlogin(token,datetime,fname,email){
	  this.setState({
		  token:token,
		  datetime:datetime,
		  fname:fname,
		  email:email
	  });
  }
  login(){
	 if (!this.state.token){
		 this.props.navigation.navigate('Login',{ 
			setlogin:this.setlogin.bind(this)
		 });
	 }else{
		 Alert.alert(
		'Logout',
		'Apakah Anda yakin untuk logout?',
		[
			{text: 'Batal', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'Yakin', onPress: () => {AsyncStorage.multiRemove(['mobtoken','datetime','fname','email']);this.setState({token:false});this.props.navigation.navigate('Home')}},
		],
		{ cancelable: false }
		)
	 }
  }
  render() {
	  var login='Login';
	  if (this.state.token){
		  login='Logout';
	  }
    return (
      <Container>
        <Content>
          <Image
            square
            style={{
              height: 80,
              width: 80,
              position: "absolute",
              alignSelf: "center",
              top: 20
            }}
            source={{
              uri:
                "https://lh3.googleusercontent.com/JiK-fKf0uuQKAvN6BA_xxfnFA0eoRuYpxP7dZdtGt2CCNy6e8ume0iGySjX20BOxaWuD=w300"
            }}
          />
          <List style={{marginTop:120}}>
			   <ListItem button onPress={() => this.props.navigation.navigate('Home')} >
                  <Text>Bid/Ask</Text>
                </ListItem>
			    <ListItem button onPress={() => this.props.navigation.navigate('History')} >
                  <Text>Riwayat Trasaksi</Text>
                </ListItem>
			    <ListItem button onPress={() => this.props.navigation.navigate('Chart')} >
                  <Text>Chart</Text>
                </ListItem>
			    <ListItem button onPress={() => this.props.navigation.navigate('Wallet')} >
                  <Text>Wallet</Text>
                </ListItem>
			    <ListItem button onPress={() => this.props.navigation.navigate('DepoWD')} >
                  <Text>Deposit/Withdraw</Text>
                </ListItem>
			    <ListItem button onPress={() => this.props.navigation.navigate('Settings')} >
                  <Text>Settings</Text>
                </ListItem>
			    <ListItem button onPress={() => this.login()} >
                  <Text>{login}</Text>
                </ListItem>
			    <ListItem button onPress={() => this.exit()} >
                  <Text>Keluar</Text>
                </ListItem>
			</List>
        </Content>
      </Container>
    );
  }
}
