import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  TouchableHighlight  
} from 'react-native';

class ModalScr extends Component {
  state = {
    modalVisible: false,
  };
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }	
 render() {
    return (
	 <View style={{marginTop: 122,paddingLeft:20,flex:1,height:100,backgroundColor:'#fff'}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22}}>
            <View>
              <Text>Order</Text>

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text>Batal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default ModalScr;
