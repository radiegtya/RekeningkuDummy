import React, { Component } from "react";
import { 
  Platform,AsyncStorage,View} from "react-native";
import { Col, Row, Grid } from 'react-native-easy-grid';
import {
   Container,
   Header,
   TextInput,
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
   Picker, 
   Form, Footer,FooterTab,
   Item as FormItem, Segment, Card } from "native-base";
var number_format = require('../../modules/number_format');
const Item = Picker.Item;
var timer;
export class BuySell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance:0,
  	  balancecoin:0,
	  coins:[],
	  bid:0,
	  ask:0,
	  hargabelishow:'none',
	  hargajualshow:'none',
      code:'BTC',
	  token:'0',
	  totalbeli:'',
	  totaljual:'',
	  hargabeli:0,
	  hargajual:0,
	  statusnum:0,
	  buttonbuydisabled: true,	
	  buttonselldisabled: true,
      selected1: 1,
	  selected2: this.props.navigation.state.params.coin,
	  selected3: 0,
	  selected4: 0,
	  selected5: 0,
	  selected6: 0
    };
	//this.state={balance:0};
	this.valnum = this.valnum.bind(this); 
    this.getcoins = this.getcoins.bind(this); 
	this.getbidaskpercoin = this.getbidaskpercoin.bind(this); 
	this.buysellnow = this.buysellnow.bind(this); 
    this.getbalance = this.getbalance.bind(this); 
	this.onValueChange=this.onValueChange.bind(this); 
	this.onValueChange2=this.onValueChange2.bind(this);
    this.onbuypct=this.onbuypct.bind(this);	
	this.onsellpct=this.onsellpct.bind(this);	
	this.showcoin = this.showcoin.bind(this);
	this.onhargabelipct=this.onhargabelipct.bind(this);	
	this.onhargajualpct=this.onhargajualpct.bind(this);	
  }
  getbidaskpercoin(){
	var balanceAPI='https://beta.rekeningku.com/id/bidaskcoin';
	fetch(balanceAPI, {
		method: 'POST',
		headers: new Headers({
		'Content-Type': 'application/x-www-form-urlencoded',
	}),
	body: "code="+this.state.selected2
	})
	.then((response) => response.json())
	.then((responseJson) => {
		if (typeof responseJson.error=='undefined'){
			this.setState({bid: responseJson.bid,ask:responseJson.ask});
		}
	});
  }
  getbalance(token){
	var balanceAPI='https://beta.rekeningku.com/id/balanceidrmob';
	fetch(balanceAPI, {
		method: 'POST',
		headers: new Headers({
		'Content-Type': 'application/x-www-form-urlencoded',
	}),
	body: "token="+token
	})
	.then((response) => response.json())
	.then((responseJson) => {
		if (typeof responseJson.error=='undefined'){
			this.setState({balance: responseJson.balanceidr,isloading:true});
		}else{
			clearInterval(timer);
			this.props.navigation.navigate('Login');
		}
	});
    var coin=this.state.selected2;
	var balanceAPI='https://beta.rekeningku.com/id/balancecoinmob';
	fetch(balanceAPI, {
		method: 'POST',
		headers: new Headers({
		'Content-Type': 'application/x-www-form-urlencoded',
	}),
	body: "token="+token+"&w="+coin
	})
	.then((response) => response.json())
	.then((responseJson) => {
		if (typeof responseJson.error=='undefined'){
			this.setState({balancecoin: responseJson.balance,code:responseJson.code,isloadingcoin:true});
		}else{
			clearInterval(timer);
			this.props.navigation.navigate('Login');
		}
	});
	this.getbidaskpercoin();
	timer=setInterval(() => {
			  this.getbalance(token);
			}, 10000);
  }
  getcoins(){
	var balanceAPI='https://beta.rekeningku.com/id/coins';
	fetch(balanceAPI, {
		method: 'GET',
		headers: new Headers({
		'Content-Type': 'application/x-www-form-urlencoded',
	}),
	})
	.then((response) => response.json())
	.then((responseJson) => {
		if (this.state.coins){
			this.setState({coins: responseJson});
		}
	});
  }
  buysellnow(){
    var st='Beli';
	var err=0;
    var totalbuy=this.state.totalbeli;
	//totalbuy=totalbuy.replace(/\./g, '')
    var totalsell=this.state.totaljual;
	var total;
    if (this.state.buttonbuydisabled==true){
		st='Jual';
		total=totalsell;
		if (parseFloat(totalsell)>parseFloat(this.state.balancecoin)){
			alert('Saldo '+this.props.navigation.state.params.code+' tidak cukup!');
			err=1;
			return true;
		}
	}else{
		total=totalbuy;
		if (parseFloat(totalbuy)>parseFloat(this.state.balance)){
			alert('Saldo tidak cukup!');
			err=1;
			return true;
		}
	}		
    var statusinstant=' Instant';
	var statusjualbeli='';	
	if (this.state.selected1==1){
		statusjualbeli=st+statusinstant;
	}else{
		statusjualbeli=st;
	}
	if (err==0){
		clearInterval(timer);
		this.props.navigation.navigate('BuySellConfirm',{token:this.state.token,hargabeli:this.state.hargabeli,hargajual:this.state.hargajual,saldo:this.state.balance,saldocoin:this.state.balancecoin,coin:this.state.selected2,code:this.state.code,total:total,statusbuysell:statusjualbeli,bid:this.state.bid,ask:this.state.ask});
	}
  }
  componentWillMount(){
	AsyncStorage.multiGet(['mobtoken','datetime','fname','email']).then((data)=>{
		token=data[0][1] || null;
		if (token!=null){
			if (this.state.token){
				this.setState({token:token});
			}
			this.getbalance(token);
		}
	});
    this.getcoins();
	this.getbidaskpercoin();
  }
  componentWillUnmount(){
   // use intervalId from the state to clear the interval
    clearInterval(timer);
  }
  viewnum(type){
	  var a;
	  if (type=='totalbeli'){
		  a=this.state.totalbeli;
    	   a=a.toString();
   		   if (a!='0'){
			   if (this.state.statusnum==1)
					a=a.replace(/\./g, '');
		   a=number_format(a,0,",",".");
		   }else{
			   a='';
		   }
	  }else if (type=='totaljual'){
		  a=this.state.totaljual;
		  a=a.toString();
		  //if (a!='0'){
			  a=a.replace(/\./g, ',');
		  //}else{
		//	  a='';
		  //}
	  }else if (type=='hargabeli'){
		   a=this.state.hargabeli;
    	   a=a.toString();
   		   if (a!='0'){
		   a=a.replace(/\./g, '');
		   a=number_format(a,0,",",".");
		   }else{
			   a='';
		   }
	  }else{
		   a=this.state.hargajual;
    	   a=a.toString();
   		   if (a!='0'){
		   a=a.replace(/\./g, '');
		   a=number_format(a,0,",",".");
		   }else{
			   a='';
		   }
	  }
	  return a;
  }
  valnum(num,type){
	  var show='none';
      if (this.state.selected1==0)
	 	 show='flex';
	  if (type=='totalbeli'){
			this.setState({hargabelishow:show,statusnum:1,hargajualshow:'none',hargabeli:this.state.bid,totalbeli: num,totaljual:0,buttonbuydisabled: false,buttonselldisabled: true});
	  }else if (type='totaljual'){
			this.setState({hargabelishow:'none',statusnum:1,hargajualshow:show,hargajual:this.state.ask,totaljual: num,totalbeli:0,buttonbuydisabled: true,buttonselldisabled: false});
	  }else if (type=='hargabeli'){
		     this.setState({hargabeli:num});
	  }else if (type=='hargajual'){
		     this.setState({hargajual:num});
	  }
  }
  onValueChange(value: numeric) {
	var showbeli='none';  
	var showjual='none';
	if (value==0){
		if (this.state.totalbeli>0)
			showbeli='flex'
		else if (this.state.totaljual>0)
			showjual='flex';
	}
    this.setState({
      selected1: value,
	  hargabelishow:showbeli,
	  hargajualshow:showjual
    });
  }
  onbuypct(value:numeric){
    var totalbeli=parseFloat(this.state.balance)*parseFloat(value);
	this.setState({totalbeli:totalbeli,statusnum:0,totaljual:'',buttonbuydisabled: false,buttonselldisabled: true});
  }
  onsellpct(value:numeric){
    var totaljual=parseFloat(this.state.balancecoin)*parseFloat(value);
	this.setState({totaljual:totaljual,statusnum:0,totalbeli:'',buttonbuydisabled: true,buttonselldisabled: false});
  }
  onhargabelipct(value:numeric){
    var hargabeli=parseFloat(this.state.ask)-(parseFloat(this.state.ask)*parseFloat(value));
	this.setState({selected5:value,hargabeli:hargabeli});
  }
  onhargajualpct(value:numeric){
    var hargajual=parseFloat(this.state.bid)+(parseFloat(this.state.bid)*parseFloat(value));
	this.setState({selected6:value,hargajual:hargajual});
  }
  onValueChange2(value: string) {
    this.setState({
      selected2: value
    });
	this.getbalance(this.state.token);
  }
  showcoin(rowData,Index){
	 return (
  < Item key={Index} label={rowData.name} value={rowData.id} />
     );
  }
  render() {
	const  coins = this.state.coins;
    return (
      <Container>
        <Header>
        <Left>
            <Button
              transparent
              onPress={() => {clearInterval(timer);this.props.navigation.navigate('Home')}}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Jual/Beli</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={{backgroundColor:'#fff'}}>
		<Form style={{flex:1}}>
		<Grid>
           <Col><Picker
                        iosHeader="Select one"
                        mode="dropdown"
                        selectedValue={this.state.selected1}
                        onValueChange={this.onValueChange.bind(this)}
                      >
                        <Item label="Jual beli" value={0} />
                        <Item label="Jual Beli instant" value={1} />
                        
                      </Picker>
         </Col>
         <Col>
                      <Picker
                        iosHeader="Select one"
                        mode="dropdown"
                        selectedValue={this.state.selected2}
                        onValueChange={this.onValueChange2.bind(this)}
                      >
						 { coins.map((rowData, index) => this.showcoin(rowData,index)	) }	
                      </Picker>
            </Col>
			</Grid>
            <Grid style={{padding:15}}>
			<Col style={{width:130}}>
                <Text>Bid/Ask</Text>
            </Col>
            <Col>
                <Text>Rp.{number_format(this.state.bid,0)}/Rp. {number_format(this.state.ask,0)}</Text>
			</Col>
            </Grid>
            <Grid style={{padding:15}}>
            <Col style={{width:130}}>
                 <Text>Saldo Rupiah</Text>
            </Col>
            <Col>
                 <Text>Rp. {number_format(this.state.balance,0,",",".")}</Text>
			</Col>
            </Grid>
            <Grid style={{padding:15}}>
            <Col style={{width:130}}>
                 <Text>Saldo {this.state.code}</Text>
            </Col>
            <Col>
                 <Text>{number_format(this.state.balancecoin,8,",",".")} {this.state.code} </Text>
			</Col>
            </Grid>
            <Grid style={{paddingLeft:15}}>
			<Col style={{width:130,paddingTop:15}}>
			  <Text>Total Beli</Text>
			</Col>
			<Col>
              <Input keyboardType='numeric'
         onChangeText={(num) => this.valnum(num,'totalbeli')}
		 value={this.viewnum('totalbeli')}
		placeholder='Total Rupiah' style={{borderBottomWidth:1,borderBottomColor:'#eee'}}/>
			</Col>
			<Col style={{width:40}}>
			<Picker
						iosHeader="Select one"
                        mode="dropdown"
						selectedValue={this.state.selected3}
						onValueChange={this.onbuypct}
                      >
					    <Item  label="Pilih Persentase Beli" value="" />
                        <Item  label="10%" value={0.1} />
                        <Item  label="25%" value={0.25} />
						<Item  label="50%" value={0.50} />
                        <Item  label="75%" value={0.75} />
						<Item  label="100%" value={1} />
                      </Picker>
			</Col>
			</Grid>
			<Grid style={{paddingLeft:15}}>
			<Col style={{width:130,paddingTop:15}}>
			  <Text>Total Jual</Text>
			</Col>
            <Col>
			<Input keyboardType='numeric' 
			onChangeText={(num) => 
			this.valnum(num,'totaljual')} 
			value={this.viewnum('totaljual')}
			placeholder='Total Coin' style={{borderBottomWidth:1,borderBottomColor:'#eee'}}/>
			</Col>
			<Col style={{width:40}}>
			<Picker
				iosHeader="Select one"
				selectedValue={this.state.selected4}
                mode="dropdown"
				onValueChange={this.onsellpct}
                      >
				   <Item label="Pilih Persentase Jual" value="" />
                   <Item label="10%" value={1} />
                   <Item label="25%" value={0.25} />
				   <Item label="50%" value={0.50} />
                   <Item label="75%" value={0.75} />
				   <Item label="100%" value={1} />
              </Picker>
			</Col>
          </Grid>
		  <Grid style={{paddingLeft:15,display:this.state.hargabelishow}}>
			<Col style={{paddingTop:15,width:130}}>
			  <Text>Harga</Text>
			</Col>
			<Col>			
              <Input keyboardType='numeric'
         onChangeText={(num) => this.valnum(num,'hargabeli')}
		 value={this.viewnum('hargabeli')}
		placeholder='Total Rupiah' style={{borderBottomWidth:1,borderBottomColor:'#eee'}}/>
			</Col>
			<Col style={{width:40}}>
			<Picker
						iosHeader="Select one"
                        mode="dropdown"
						selectedValue={this.state.selected5}
						onValueChange={this.onhargabelipct}
                      >
					    <Item  label="Pilih Persentase Harga Beli" value="" />
                        <Item  label="ASK Price -3%" value={0.03} />
                        <Item  label="ASK Price -2%" value={0.02} />
						<Item  label="ASK Price -1%" value={0.01} />
						<Item  label="ASK Price -0,5%" value={0.005} />
                        <Item  label="ASK Price -0,25%" value={0.0025} />
						<Item  label="ASK Price -0,1%" value={0.001} />
                      </Picker>
			</Col>
			</Grid>
		  <Grid style={{paddingLeft:15,display:this.state.hargajualshow}}>
			<Col style={{paddingTop:15,width:130}}>
			  <Text>Harga</Text>
			</Col>
			<Col>			
              <Input keyboardType='numeric'
         onChangeText={(num) => this.valnum(num,'hargajual')}
		 value={this.viewnum('hargajual')}
		placeholder='Total Coin' style={{borderBottomWidth:1,borderBottomColor:'#eee'}}/>
			</Col>
			<Col style={{width:40}}>
			<Picker
						iosHeader="Select one"
                        mode="dropdown"
						selectedValue={this.state.selected6}
						onValueChange={this.onhargajualpct}
                      >
					    <Item  label="Pilih Persentase Harga Jual" value="" />
                        <Item  label="BID Price +2%" value={0.02} />
                        <Item  label="BID Price +1%" value={0.01} />
						<Item  label="BID Price +0,5%" value={0.005} />
						<Item  label="BID Price +0,25%" value={0.0025} />
                        <Item  label="BID Price +0,1%" value={0.001} />
                      </Picker>
			</Col>
			</Grid>					
          </Form>      
        </Content>
        <Footer>
          <FooterTab>
			<Button vertical disabled={this.state.buttonselldisabled} 
			onPress={() => this.buysellnow()}	><Icon name="paper-plane" /><Text> Jual </Text></Button>
		    <Button vertical disabled={this.state.buttonbuydisabled}
			 onPress={() => this.buysellnow()}	><Icon name="briefcase" /><Text> Beli </Text></Button>
		  </FooterTab>	
		</Footer>
      </Container>
    );
  }
}     
export default BuySell;      