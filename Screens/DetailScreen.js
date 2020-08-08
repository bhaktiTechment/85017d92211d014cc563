import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

export default class DetailScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            params:props.navigation.getParam('item', 'NO-ID')
        }
    }
  render() {
      const {params} = this.state;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{JSON.stringify(params)}</Text>
      </View>
    )
  }
}