import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, Text, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Octicons';
import { AppStyle } from '../assets/styles/AppStyle';
import { TabStyle } from '../assets/styles/TabStyle';
import { Colors } from '../assets/styles/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerStyle } from '../assets/styles/DrawerStyle';
import { LogoutUrl, NotificationsUrl, MyAccountUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper } from '../HelperApi/Api/HTTPHelper';
// const Tabs = createBottomTabNavigator();
// const size = 30;
// const color = Colors.buttonColor;

var notifyData;
var getNotifyDetails;

export function CustomTab({ state, descriptors, navigation }) {
  const [settingDetails, setSettingDetails] = useState([]);
  const [accessKeyDetails, setAccessKeyDetails] = useState({});
  const [isPressed, setIsPressed] = useState(false);
  const [notificationLength, setNotificationLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [webFlag, setWebFlag] = useState('');
  const [webLink, setWebLink] = useState(false);



  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    const storedAccessData = await AsyncStorage.getItem('accessKey')
    if (storedAccessData != null) {
      const keyData = JSON.parse(storedAccessData);
      setAccessKeyDetails(keyData)
      if (keyData) {
        let notificationDetails = HttpHelper(
          NotificationsUrl + 'accesskey' + '=' + keyData.key, 'GET');
        notificationDetails.then((response) => {
          if (response.status === 'true') {
            var filterReadStatus = response.notification.filter(e => e.read === "N");
            if (filterReadStatus && filterReadStatus.length > 0) {
              getNotifyDetails = filterReadStatus;
            }
          }
        })
        let MyAccountDeatils = HttpHelper(
          MyAccountUrl + 'accesskey' + '=' + keyData.key, 'GET');
        MyAccountDeatils.then((response) => {
          if (response.status === 'true') {
            setWebFlag(response.user.webflag);
            setWebLink(response.user.weblink);
          }
        });
      }
    }
  }
  const getIconImage = (name, isFocused) => {
    if (name === 'Shop') {
      return <Image source={require('../assets/images/icons/shop.png')} style={{ tintColor: isFocused ? Colors.buttonColor : Colors.tabInActiveColor, width: 24, height: 30, alignSelf: 'center' }} />
    } else if (name === 'Chat') {
      return <Image source={require('../assets/images/icons/chat.png')} style={{ tintColor: isFocused ? Colors.buttonColor : Colors.tabInActiveColor, width: 30, height: 30, alignSelf: 'center' }} />
    }
    else {
      return (
        <View style={getNotifyDetails && getNotifyDetails.length > 0 ? { flexDirection: 'row', alignSelf: 'center', left: 10 } : { flexDirection: 'row', alignSelf: 'center' }}>
          <Image source={require('../assets/images/icons/settings.png')} style={{ tintColor: isFocused ? Colors.buttonColor : Colors.tabInActiveColor, width: 30, height: 30, alignSelf: 'center' }} />
          {getNotifyDetails && (<Icon
            name="primitive-dot"
            size={25}
            color={Colors.redColor}
            style={{ width: 33, top: -10 }}
          />)}
        </View>
      )
    }
  }
  return (
    <SafeAreaView backgroundColor={Colors.lightTxtColor} style={{
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    }}>
      <View style={TabStyle.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;
          // const icon = label === 'Shop' ? 'shopping-bag' 
          //           : label === 'Chat' ? 'wechat'
          //           : 'gear';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });
            if (!isFocused && !event.defaultPrevented) {
              if (label === "Chat" && webFlag === "True") {
                Linking.openURL(webLink);
                navigation.navigate(route.name);
              } else {
                navigation.navigate(route.name);
              }
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1 }}
            >
              {getIconImage(label, isFocused)}
              {/* <Icon name={icon} size={30} color={isFocused ? Colors.buttonColor : Colors.tabInActiveColor } style={{ textAlign: 'center'}}/> */}
              <Text style={[TabStyle.tabText, { color: isFocused ? Colors.buttonColor : Colors.tabInActiveColor }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
