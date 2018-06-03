import React, { Component } from "react";
import { 
  Platform,View } from "react-native";
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
export default class Trade extends Component {
  constructor(props) {
    super(props);
	this.buysellprocess = this.buysellprocess.bind(this); 
	this.state={
		mytotal:0,
		estimasi:0,
		amount:0,
		btncolor:'#ff0000',
		ask:0,
		bid:0
	}
  }
  componentDidMount(){
	var mytotal=this.props.navigation.state.params.total;
	var estimasi;
	var status=this.props.navigation.state.params.statusbuysell;
	var kurs='Rp ';
	var btncolor="#ff0000";
	var myamount;
	if (status=='Jual' || status=='Jual Instant'){
		kurs=this.props.navigation.state.params.code;
		if (status=='Jual')
			myamount=this.props.navigation.state.params.hargajual;
		else
			myamount=this.props.navigation.state.params.bid;
		estimasi="Rp "+number_format(parseFloat(mytotal)*parseFloat(myamount),0,",",".");
		this.setState({estimasi:estimasi,amount:myamount});
		mytotal=number_format(mytotal,8,",",".");
	}else{
		if (status=='Beli')
			myamount=this.props.navigation.state.params.hargabeli;
		else
			myamount=this.props.navigation.state.params.ask;
		btncolor="#79c879";
		estimasi=number_format(parseFloat(mytotal)/parseFloat(this.props.navigation.state.params.ask),8,",",".")+" "+this.props.navigation.state.params.code;
		this.setState({estimasi:estimasi,amount:myamount});
		mytotal=kurs+number_format(mytotal,0,",",".");
	}
	this.setState({
		mytotal:mytotal,
		btncolor: btncolor
	});	
  }
  buysellprocess(){
	var orderApi="https://beta.rekeningku.com/id/doordermob";
	var coin=this.props.navigation.state.params.coin;
	var token=this.props.navigation.state.params.token;
	var status=this.props.navigation.state.params.statusbuysell;
	var st=0;
	if (status=='Beli')
		st=0;
	else if (status=='Jual')
		st=1;
	else if (status=='Beli Instant')
		orderApi="https://beta.rekeningku.com/id/doinstantbuymob";
	else if (status=='Jual Instant')
		orderApi="https://beta.rekeningku.com/id/doinstantsellmob";
	var sisa;
	if (st==0 ||st==1){
		sisa='&transtype='+st+'&amount='+this.state.amount;
	}
	var total=this.props.navigation.state.params.total;
	fetch(orderApi, {
		method: 'POST',
		headers: new Headers({
		'Content-Type': 'application/x-www-form-urlencoded',
	}),
	body: "token="+token+"&coin="+coin+"&total="+total+sisa
	})
	.then((response) => response.json())
	.then((responseJson) => {
		if (typeof responseJson.error !="undefined"){
			alert(responseJson.error);
		}else if (responseJson.success==1){
			this.props.navigation.navigate('BuySellSuccess',{token:token,coin:coin,code:this.props.navigation.state.params.code,status:status,total:this.state.mytotal,estimasi:this.state.estimasi,amount:this.state.amount});
		}
	});
  }
  
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
            <Title>{this.props.navigation.state.params.statusbuysell}</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={{backgroundColor:'#fff'}}>
		<Form style={{flex:1}}>
            <Grid style={{paddingLeft:8,paddingTop:5,paddingBottom:5}}>
			<Col style={{width:130}}>
                <Text>Coin</Text>
            </Col>
            <Col>
                <Text>{this.props.navigation.state.params.code}</Text>
			</Col>
			</Grid>
            <Grid style={{paddingLeft:8,paddingTop:5,paddingBottom:5}}>
            <Col style={{width:130}}>
                 <Text>Saldo Rupiah</Text>
            </Col>
            <Col>
                 <Text>{number_format(this.props.navigation.state.params.saldo,0,",",".")}</Text>
			</Col>
            </Grid>
            <Grid style={{paddingLeft:8,paddingTop:5,paddingBottom:5}}>
            <Col style={{width:130}}>
                 <Text>Saldo {this.props.navigation.state.params.code}</Text>
            </Col>
            <Col>
                 <Text>{this.props.navigation.state.params.saldocoin} {this.props.navigation.state.params.code}</Text>
			</Col>
            </Grid>
            <Grid style={{paddingLeft:8,paddingTop:5,paddingBottom:5}}>
            <Col style={{width:130}}>
                 <Text>Estimasi Harga</Text>
            </Col>
            <Col>
                 <Text>Rp {number_format(this.state.amount)} </Text>
			</Col>
			</Grid>
            <Grid style={{paddingLeft:8,paddingTop:5,paddingBottom:5}}>
            <Col style={{width:130}}>
                 <Text>Total</Text>
            </Col>
            <Col>
                 <Text>{this.state.mytotal} </Text>
			</Col>
			</Grid>
			<Grid style={{paddingLeft:8,paddingTop:5,paddingBottom:5}}>
            <Col style={{width:130}}>
                 <Text>Estimasi</Text>
            </Col>
            <Col>
                 <Text>{this.state.estimasi}</Text>
			</Col>
			</Grid>
          </Form>      
        </Content>
        <Footer>
          <FooterTab>
			<Button  vertical style={{backgroundColor:this.state.btncolor}}
			onPress={() => this.buysellprocess()}	><Icon name="paper-plane" /><Text> {this.props.navigation.state.params.statusbuysell} {this.props.navigation.state.params.code}</Text></Button>
		  </FooterTab>	
		</Footer>
      </Container>
    );
  }
}           