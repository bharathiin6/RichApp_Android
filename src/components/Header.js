import React from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { AppStyle } from '../assets/styles/AppStyle';
import { Colors } from '../assets/styles/Colors';

const Header = (props) => {
  if (props.isLoggedin) {
  }

  return (
    <View style={AppStyle.headerStyle}>
      <View style={AppStyle.headerContainer}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={AppStyle.headerLeft}
            onPress={() => props.navigation.openDrawer()}>
            <Image
              source={require('../assets/images/icons/menu.png')}
              resizeMode='cover'
              style={AppStyle.headerIcon}
            />
          </TouchableOpacity>
          <Image
            source={require('../assets/images/text-logo.png')}
            style={AppStyle.headerLogo}
          />
        </View>

        <TouchableOpacity
          style={AppStyle.headerRight}
          onPress={() => props.navigation.push('FilterScreen')}>
          <Image
            source={require('../assets/images/icons/filter.png')}
            style={AppStyle.headerIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
