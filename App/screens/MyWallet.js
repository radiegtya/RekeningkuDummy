import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Modal,
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
var walletdata;
class MyWallet extends Component {
  constructor(	props) {
    super(props);
	this.state = {loading:false,imgurl:'',address:'',desc:''}
  }	
  componentWillMount(){
	var token;
	var id=this.props.navigation.state.params.id;
	AsyncStorage.multiGet(['mobtoken','datetime','fname','email']).then((data)=>{
	    token=data[0][1] || null;
	    var walletAPI='https://beta.rekeningku.com/id/mywalletmob';
	    return	fetch(walletAPI, {
		method: 'POST',
		headers: new Headers({
		'Content-Type': 'application/x-www-form-urlencoded',
		}),
		body: "token="+token+"&id="+id
		})
		.then((response) => response.json())
		.then((responseJson) => {
		if (typeof responseJson.error=='undefined'){
			var address=responseJson.address;
			var xcode=responseJson.name;
			var code=xcode.toLowerCase();
			var desc='Scan barcode disebelah atas melalui smartphone atau gadget lainnya untuk mempermudah pengiriman saldo '+code+'. Waktu terima saldo dibutuhkan sekitar 30 menit - 1 jam. Atau share alamat '+code+' ke pengirim.';
			var imgurl='https://chart.googleapis.com/chart?cht=qr&chld=Q|2&chs=300&chl='+code+'%3A'+address;
			this.setState({loading:true,imgurl:imgurl,address:address,desc:desc});
		}
	    });
	});	
 }
 render() {
	 if (this.state.loading==false){
		return(
		<Container>
        <Header>
            <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('Wallet')}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Wallet {this.props.navigation.state.params.name}</Title>
          </Body>
          <Right />
        </Header>
			<View style={[styles.container, styles.horizontal]}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		</Container>
		)
	}
	return (
      <Container>
        <Header>
          <Left>
           <Button
              transparent
              onPress={() => this.props.navigation.navigate('Wallet')}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Wallet {this.props.navigation.state.params.name}</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{backgroundColor:'#fff'}}>
			<View style={{padding:20,backgroundColor:'#fff',flex:1,justifyContent: 'center', alignItems: 'center'}}>
			<Image source={{uri:this.state.imgurl}} style={{width:300,height:300}}/>
			</View>	 
			<View style={{padding:20,backgroundColor:'#fff'}}>
				 <Text>{this.state.desc}</Text>
			</View>	 
			<View style={{padding:20,backgroundColor:'#fff'}}>
				 <Text>{this.state.address}</Text>
			</View>
        </Content>
		</Container> 
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})
export default MyWallet;
