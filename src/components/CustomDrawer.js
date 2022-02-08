import React, { useState, useEffect } from 'react';
import { View, Image, Text, Dimensions, ScrollView,ActivityIndicator } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppStyle } from '../assets/styles/AppStyle';
import { DrawerStyle } from '../assets/styles/DrawerStyle';
import { AuthContext } from '../common/context';
import { Colors } from '../assets/styles/Colors';
const { width, height } = Dimensions.get('screen');
import { LogoutUrl, NotificationsUrl, MyAccountUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper } from '../HelperApi/Api/HTTPHelper';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Drawer = createDrawerNavigator();
const size = 30;
const color = Colors.buttonColor;
var notifyData;
var userData;

var getNotifyDetails;
var getUserDetails;


export function CustomDrawer(props) {
  // const { signOut } = React.useContext(AuthContext);
  const [accessKeyDetails, setAccessKeyDetails] = useState({});
  const [image, setImage] = useState('');
  const [notificationDetail, setNotificationDetail] = useState('');
  const [notificationLength, setNotificationLength] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [webFalg, setWebFalg] = useState('');
  const [webLink, setWebLink] = useState(false);



  useEffect(() => {
    const interval = setInterval(() => {
      getDetails();
    }, 1000);
    return () => clearInterval(interval);
  });



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
              setNotificationLength(filterReadStatus.length)
            }
          }
        })
        let MyAccountDeatils = HttpHelper(
          MyAccountUrl + 'accesskey' + '=' + keyData.key, 'GET');
        MyAccountDeatils.then((response) => {
          if (response.status === 'true') {
            setImage(response.user.image);
            setWebFalg(response.user.webflag);
            setWebLink(response.user.weblink);

          }
        });
      }
    }
  }

  const _logout = async () => {
    const fcmToken = await messaging().getToken();
    if (accessKeyDetails && accessKeyDetails != null) {
      let logOut = HttpHelper(LogoutUrl + 'accesskey' + '=' + accessKeyDetails.key + '&' + 'fcmkey' + '=' + fcmToken, 'GET');
      logOut.then(response => {
        if (response && response.status === "true") {
          try {
            AsyncStorage.removeItem('user', (err) => {
              AsyncStorage.removeItem('accesskey', (err) => {
                AsyncStorage.removeItem('notificationDetails', (err) => {
                  AsyncStorage.removeItem('isLogin', (err) => {
                    props.navigation.push('Landing');
                  });
                });
              });
            });
          } catch (error) { }
        }
      })
    }
  };
  return (
    <ScrollView style={[DrawerStyle.menuContainer]}>
      <DrawerContentScrollView {...props}>
        <View style={[DrawerStyle.drawerContent, { width: width - 80 }]}>
          <View style={image ? DrawerStyle.avatarImage :DrawerStyle.avatarContainer}>
            <Image
              source={{ uri: image ? image : null }}
              style={DrawerStyle.avatarImage}
            />        
          </View>
          <View style={DrawerStyle.drawerSection}>
            <DrawerItem
              icon={() => (
                <Image
                  style={DrawerStyle.drawerImage}
                  resizeMode="contain"
                  source={require('../assets/images/icons/shop.png')}
                />
              )}
              labelStyle={DrawerStyle.labelStyle}
              label="Shop"
              onPress={() => {
                props.navigation.navigate('Home');
              }}
            />
            <DrawerItem
              icon={() => (
                <Image
                  style={DrawerStyle.drawerImage}
                  resizeMode="contain"
                  source={require('../assets/images/icons/user.png')}
                />
              )}
              labelStyle={DrawerStyle.labelStyle}
              label="My Profile"
              onPress={() => {
                props.navigation.navigate('ProfileScreen', { isHome: true });
              }}
            />
            <DrawerItem
              icon={() => (
                <Image
                  style={DrawerStyle.drawerImage}
                  resizeMode="contain"
                  source={require('../assets/images/icons/product.png')}
                />
              )}
              labelStyle={DrawerStyle.labelStyle}
              label="My Products"
              onPress={() => {
                props.navigation.navigate('MyProduct', { isHome: true });
              }}
            />
            <DrawerItem
              icon={() => (
                notificationLength ?
                  <Image
                    style={DrawerStyle.drawerImage}
                    resizeMode="contain"
                    source={require('../assets/images/icons/notificationRed.png')}
                  /> :
                  <FontAwesome
                    name="bell-o"
                    size={25}
                    color={Colors.bellColor}></FontAwesome>
              )}
              labelStyle={DrawerStyle.labelStyle}
              label="Notifications"
              onPress={() => {
                props.navigation.navigate('Notification', { isHome: true });
              }}
            />
            {/* <DrawerItem
              icon={() => (
                <Image
                  style={DrawerStyle.drawerImage}
                  resizeMode="contain"
                  source={require('../assets/images/icons/subscription.png')}
                />
              )}
              labelStyle={DrawerStyle.labelStyle}
              label="Subscriptions"
              onPress={() => {
                props.navigation.navigate('Subscription');
              }}
            /> */}
            {/* <DrawerItem
              icon={() => (
                <Image
                  style={DrawerStyle.drawerImage}
                  resizeMode="contain"
                  source={require('../assets/images/icons/regulation.png')}
                />
              )}
              labelStyle={DrawerStyle.labelStyle}
              label="Regulations"
              onPress={() => {
                props.navigation.navigate('Conversation');
              }}
            /> */}
            <DrawerItem
              icon={() => (
                <Image
                  style={DrawerStyle.drawerImage}
                  resizeMode="contain"
                  source={require('../assets/images/icons/regulation.png')}
                />
              )}
              labelStyle={DrawerStyle.labelStyle}
              label="Terms of Services"
              onPress={() => {
                props.navigation.navigate('TermsOfService', { isTerm: true, isHome: true });
              }}
            />
            <DrawerItem
              icon={() => (
                <Image
                  style={DrawerStyle.drawerImage}
                  resizeMode="contain"
                  source={require('../assets/images/icons/privacy.png')}
                />
              )}
              labelStyle={DrawerStyle.labelStyle}
              label="Privacy Policy"
              onPress={() => {
                props.navigation.navigate('TermsOfService', { isTerm: false, isHome: true });
              }}
            />
            <DrawerItem
              icon={() => (
                <Image
                  style={DrawerStyle.drawerImage}
                  resizeMode="contain"
                  source={require('../assets/images/icons/logout.png')}
                />
              )}
              labelStyle={DrawerStyle.labelStyle}
              label="Logout"
              onPress={() => {
                _logout()
              }}
            />
          </View>
        </View>
      </DrawerContentScrollView>
      <View style={{ marginBottom: 50 }}>
        <Text style={DrawerStyle.versionText}>RichVersion 1.0</Text>
      </View>
    </ScrollView>
  );
}
