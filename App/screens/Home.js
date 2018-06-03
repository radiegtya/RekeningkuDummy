import React, { Component } from "react";
import {
  StyleSheet,
	View,
	Platform,
	AsyncStorage,
	BackHandler,
  ActivityIndicator,
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
import Grids from './grids';
import wamp from 'wamp.js2';

const bidaskAPI = 'https://beta.rekeningku.com/id/bidask';
let listener
export class Home extends Component {
  constructor(	props) {
    super(props);
	this.openmodal=this.openmodal.bind(this);
	this.stream=this.stream.bind(this);
	this.state = {loading:false,dataSource:[],modalVisible: false,mycode:'',mycoin:0,myscreen:'Login'};
	this.onBackClicked = this.onBackClicked.bind(this);
 }	
 componentDidMount() {
	if (Platform.OS == "android" && listener == null) {
		listener = BackHandler.addEventListener("hardwareBackPress", () => {
			return false;
		});
	}
 }
 openmodal(st,mycode,mycoin){ 
   if (typeof mycode=='undefined')
     var mycode='';
	this.setState({modalVisible: st,mycode:mycode,mycoin:mycoin});
 }
 componentWillMount(){
	if (Platform.OS === 'android') {
		BackHandler.addEventListener('hardwareBackPress', this.onBackClicked);
	}
	AsyncStorage.multiGet(['mobtoken','datetime','fname','email']).then((data)=>{
		token=data[0][1] || null;
		var screen='';
		if (token!=null){
			screen='BuySell';
		}else{
			screen='Login';
		}
		return fetch(bidaskAPI)
		.then((response) => response.json())
		.then((responseJson) => {
			if (this.state.dataSource && this.state.myscreen) {
				this.setState({
					dataSource: responseJson, 
					myscreen:screen,
					loading:true
				},function(){
				});
			}
			this.stream(this);	  
	 });
	});	
 }
 componentWillUnmount() {
	if (Platform.OS === 'android') {
		BackHandler.removeEventListener("hardwareBackPress", this.onBackClicked);
	}
}
onBackClicked() {
	alert('back')
	return true;
} 

   stream(my) {
 	var connection = new wamp.Connection({url: 'wss://beta.rekeningku.com/streambeta', realm: 'realm1'});
    connection.onopen = function (session) {
		function onevent(args) {
			var data=args[0];
			var transtype=data.transtype;
			var accid=data.accountid;
			var total=data.total;
			var o=data.o-1;
			var code=data.code;
			if (typeof code !='undefined'){
			var order_amount=data.order_amount;
			var amount=data.amount;
			if (typeof data.st!='undefined'){
				var st=data.st;
				var changepct=0;
				if (typeof data.changepct !="undefined")
					changepct=data.changepct;
				var zero;
				var bidval=my.state.dataSource[o].bid;
				var askval=my.state.dataSource[o].ask;
				var amountbid=0;
				var amountask=0;
				var stval='#1959a1';
				if (transtype==0 || transtype==20){
					amountbid=amount;
					amountask=askval;
				}else if (transtype==1 || transtype==21){
					amountask=amount;
					amountbid=bidval;
				}
				zero=0;
				if (bidval==0)
					zero=1;
				if ((st==1 || st==3) && bidval==amountbid){
					bidval=0;
				}
				if ((st==1 || st==3) && askval==amountask){
					askval=0;
				}
				my.state.dataSource[o].color=stval;
				my.setState({
					dataSource: my.state.dataSource
				});
				if ((amountbid>bidval && bidval!=0 && st==0) || st==4 || zero==1){
					if (amountbid>0){
						if (amountbid>bidval)
							stval='#6aaf6a';
						my.state.dataSource[o].bid=amountbid;
						my.state.dataSource[o].color=stval;
						my.setState({
						dataSource: my.state.dataSource
						});					
				   }
				}
				zero=0;
				if (askval==0)
					zero=1;
				if ((amountask<askval && askval!=0 && st==0) || st==4 || zero==1){
					if (amountask>0){
						if (amountask<askval)
							stval='#ff0000';
						my.state.dataSource[o].ask=amountask;
						my.state.dataSource[o].color=stval;
						my.setState({
						dataSource: my.state.dataSource
						});
					}
				}
			}	
			}	
		}	
		session.subscribe('order', onevent);
	};
	connection.open();
 }   

  render() {
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
            <Title>Bid/Ask</Title>
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
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Bid/Ask</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{backgroundColor:'#fff'}}>
		<View style={{marginTop: 0}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
          }}>
          <View style={{marginTop: 302,flex:1,padding:20,height:100,backgroundColor:'#fff',borderTopWidth:0.1,borderColor:'#666'}}>
            <View>
              <Text style={{fontSize:28,fontWeight:'bold'}}>{this.state.mycode}</Text>
              <TouchableHighlight
                onPress={() => {
                 this.openmodal(false,'','');
                 this.props.navigation.navigate(this.state.myscreen,{code:this.state.mycode,coin:this.state.mycoin});
                }}>
                <Text style={{fontSize:22,marginTop:20}}>New Order</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  this.openmodal(false,'','');
                }}>
                <Text style={{fontSize:22}}>Batal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
	  </View>
          <Grids openmodal={this.openmodal} dataSource={this.state.dataSource} />
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
export default Home;
