import React, { Component, useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { AppStyle } from '../assets/styles/AppStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from '../assets/styles/Colors';

const SecondaryHeader = (props) => {
  const [isMyProduct, setIsMyProduct] = useState(props.isMyProduct);
  const [isProductDetails, setIsProductDetails] = useState(props.productDetails);
  const [isAddProduct, setIsAddProduct] = useState(props.isAddProduct);
  const [isSetting, setIsSetting] = useState(props.isSetting);
  const [isConversation, setIsConversation] = useState(props.conversation);
  const [isChat, setIsChat] = useState(props.chat);



  return (
    <View style={AppStyle.secondaryHeaderStyle}>
      <View style={AppStyle.headerContainer}>
        <TouchableOpacity
          style={AppStyle.headerLeft}
          onPress={() => props.navigation.push(isProductDetails ? 'Home' : 'Notification')}>
          <AntDesign
            style={{ height: 30, alignSelf: 'center' }}
            name="arrowleft"
            color={Colors.lightWhiteColor}
            size={30}
          />
        </TouchableOpacity>
        <Text numberOfLines={1} style={AppStyle.secondaryHeaderTitle}>{props.title}</Text>
        {isMyProduct ? (
          <TouchableOpacity
            onPress={() => props.navigation.push('AddProduct', { isAdd: true })}
            style={AppStyle.secondaryHeaderAdd}>
            <Ionicons name="add-outline" size={40} color={Colors.buttonColor} />
          </TouchableOpacity>
        ) : (
            <TouchableOpacity style={{ width: 40 }}></TouchableOpacity>
          )}
        {/* </View> */}
      </View>
    </View>
  );
};
export default SecondaryHeader;