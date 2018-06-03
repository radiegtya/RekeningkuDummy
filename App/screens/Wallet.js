import React, { Component } from "react";
import {
  StyleSheet,
  View,
	Modal,
	Keyboard,
  Image,
  AsyncStorage,
  ActivityIndicator,
  TouchableHighlight,  
} from 'react-native';
import {
  Button,
  Text,
  Container,
  Body,
  Grid,
  Col,
  Content,
  Header,
  Title,
  Left,
  Icon,
  Right
} from "native-base";
var number_format = require('../../modules/number_format');
var timer;
class Wallet extends Component {
  constructor(	props) {
    super(props);
	this.state = {isLogin:false,loading:false,dataSource:[]}
	this._renderRow=this._renderRow.bind(this);
	this.getwallet=this.getwallet.bind(this);
  }	
  _renderRow(rowData, index) {
	var code=rowData.code;
	var name=rowData.name;
	var myimg='https://beta.rekeningku.com/id/images/accounts/'+code.toLowerCase()+'.png';
    return (
		<TouchableHighlight key={index}
           onPress={() => {
 			 clearInterval(timer);this.props.navigation.navigate('MyWallet',{id:code,name:name});
           }}>
		<View key={index} style={{paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderBottomColor:'#eee'}}>
		<Grid>
		<Col style={{width:80}}>
		<Text style={{fontSize:16}}><Image style={{width:50,height:50}} source={{uri:myimg}} /> {rowData.code}</Text>
		</Col>
		<Col>
			<Text style={{fontSize:16}}>{rowData.name}</Text>
		</Col>
		<Col>
			<Text style={{fontSize:16,alignSelf: 'flex-end'}}>{number_format(rowData.balance,8,",",".")}</Text>
		</Col>
		</Grid>
		</View>
		</TouchableHighlight>
    );
  }
  getwallet(token){
	 if (typeof this.state.dataSource !='undefined'){ 
  	 var walletAPI='https://beta.rekeningku.com/id/walletmob';
	 return	fetch(walletAPI, {
		method: 'POST',
		headers: new Headers({
		'Content-Type': 'application/x-www-form-urlencoded',
	}),
	body: "token="+token
	})
	.then((response) => response.json())
	.then((responseJson) => {
		if (typeof responseJson.error=='undefined'){
			this.setState({loading:true,dataSource:responseJson});
		}
	});
	timer=setInterval(() => {
	  this.getwallet(token);
	}, 30000);
	}
  }
 componentWillMount(){
	 var token;
	AsyncStorage.multiGet(['mobtoken','datetime','fname','email']).then((data)=>{
		token=data[0][1] || null;
		if (token!=null){
			this.setState({isLogin:true});
			this.getwallet(token);
		}	
	});	
 }
 componentWillUnMount(){
  clearInterval(timer);
 }
 render() {
	 var viewdefault;
	 if (this.state.loading==false && this.state.isLogin==true){
		viewdefault=  
		 	<View style={[styles.container, styles.horizontal]}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
	 }else{
		 viewdefault=
		 	<View style={[styles.container, styles.horizontal]}>
				<Image source={require('../../images/wallet.png')} style={styles.imgcenter}/>
			</View>
	 }
	 if (this.state.loading==false){
	return(
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
            <Title>Wallet</Title>
          </Body>
          <Right />
        </Header>
		{viewdefault}
		</Container>
	)
	}
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
            <Title>Wallet</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{backgroundColor:'#fff'}}>
			<View style={{padding:20,backgroundColor:'#fff'}}>
				 { this.state.dataSource.map((rowData, index) => this._renderRow(rowData, index)) }
			</View>
        </Content>
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
export default Wallet;
