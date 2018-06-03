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
var number_format = require('../../modules/number_format');
var historydata;
var timer;
class History extends Component {
  constructor(	props) {
    super(props);
	this.state = {isLogin:false,loading:false,dataSource:[]}
	this._renderRow=this._renderRow.bind(this);
  }	
  _renderRow(rowData, index) {
	  var code=rowData.accountcode;
	  var totaldone=number_format(rowData.totaldone,0,",",".");
	  var trxamount=number_format(rowData.trx_amount,8,",",".");
	  if (rowData.accountcode=='wd'){
		  if (rowData.transtype==0)
			  code='DPO';
		  else
			  code='WD';
		  totaldone='N/A';
		  trxamount='N/A';
	  }
    return (
		<View key={index} style={{paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderBottomColor:'#eee'}}>
		<Grid>
		<Col style={{width:40}}>
		<Text style={{fontSize:14}}>{code}</Text>
		</Col>
		<Col>
			<Text style={{fontSize:14,alignSelf: 'flex-end'}}>{totaldone}</Text>
		</Col>
		<Col>
			<Text style={{fontSize:14,alignSelf: 'flex-end',color:this.state.color}}>{trxamount}</Text>
		</Col>
		<Col>
			<Text style={{fontSize:14,alignSelf: 'flex-end',color:this.state.color}}>{number_format(rowData.amount,0,",",".")}</Text>
		</Col>
		</Grid>
		</View>
    );
  }
  gettrade(token){
  	 var historyAPI='https://beta.rekeningku.com/id/gettrademob';
	 return	fetch(historyAPI, {
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
		  this.gettrade(token);
	}, 10000);
  }
 componentWillMount(){
	AsyncStorage.multiGet(['mobtoken','datetime','fname','email']).then((data)=>{
		token=data[0][1] || null;
		if (token!=null){
			this.setState({isLogin:true});
			this.gettrade(token);
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
				<Image source={require('../../images/history.png')} style={styles.imgcenter}/>
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
            <Title>History</Title>
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
            <Title>Riwayat</Title>
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
export default History;
