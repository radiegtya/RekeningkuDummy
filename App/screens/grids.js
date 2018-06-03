import React, { Component } from 'react'
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  Keyboard,
  ScrollView,
  TouchableHighlight,
  Text
} from 'react-native'
import PropTypes from 'prop-types'
import { Col, Row, Grid } from 'react-native-easy-grid';
var number_format = require('../../modules/number_format');
class Grids extends Component {
  constructor(props) {
    super(props);
	this.state = {
            x: new Animated.Value(0),
        };
    // Change the state every second or the time given by User.
	this.openmodal=this.openmodal.bind(this);
	this._renderRow=this._renderRow.bind(this);
  }
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      width: PropTypes.number
    })).isRequired,
    height: PropTypes.number,
    dataSource: PropTypes.array.isRequired,
    renderCell: PropTypes.func,
	
  };
  static defaultProps = {
    columns: [],
    dataSource: [],
    renderCell: undefined
  };
  openmodal(st,mycode,mycoin){
     if (typeof mycode=='undefined')
		var mycode='';
	  this.props.openmodal(st,mycode,mycoin);
  }
  _renderRow(rowData, index) {
	  var color="#666666";
	  if (typeof rowData.color !="undefined"){
		  color=this.state.x.interpolate({
			  inputRange:[0,300],
			  outputRange:[rowData.color,'#666666']
		  });
  	     Animated.timing(
         this.state.x,
          {
            toValue: 300,
      duration:1000,
      delay:5,
			easing:Easing.easing
          }
         ).start();
	  }
    return (
	  	<TouchableHighlight key={index}
           onPress={() => {
 			 this.openmodal(true,rowData.code,rowData.accid);
           }}>

		<View key={index} style={{paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderBottomColor:'#eee'}}>
		<Grid>
		<Col style={{width:40}}>
			<Text style={{width:40,fontSize:18}}>{rowData.code}</Text>
		</Col>
		<Col>
			<Animated.Text key={index} style={{fontSize:18,alignSelf: 'flex-end',color:color}}>{number_format(rowData.bid,0,",",".")}</Animated.Text>
		</Col>
		<Col>
			<Animated.Text key={index} style={{fontSize:18,alignSelf: 'flex-end',color:color}}>{number_format(rowData.ask,0,",",".")}</Animated.Text>
		</Col>
		</Grid>
		</View>
		</TouchableHighlight>
    );
  }

  render() {
    let { dataSource } = this.props;
    return (
		<View style={{padding:20,backgroundColor:'#fff'}}>
            { dataSource.map((rowData, index) => this._renderRow(rowData, index)) }
		</View>
    )
  }
}


export default Grids
