import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
  Modal, Text,
  BackHandler, ImageBackground
} from 'react-native';
import { Colors } from '../assets/styles/Colors';
import SplashScreen from 'react-native-splash-screen';
import DropdownAlert from 'react-native-dropdownalert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '../auth/Login';
import Home from '../container/HomeScreen';
import {
  LoginUrl,
  AccessUrl,
  GCMRegistrationUrl, NotificationsUrl
} from '../HelperApi/Api/APIConfig';
import {
  HttpHelper,
} from '../HelperApi/Api/HTTPHelper';
import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation';
import { Styles } from './Styles';
import { LongPressGestureHandler } from 'react-native-gesture-handler';
var accessKeyData = {};

class Dash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isLoggedinState: 0,
      isLoading: false,
      isConnected: true,
      token: '',
      accessKeyData: [],
      loginData: [],
    };
    this.getAuthorizedLogin = this.getAuthorizedLogin.bind(this);
  }
  componentWillMount() {
    SplashScreen.hide();
    Orientation.lockToPortrait();
    // this.getMain();
  }
  componentDidMount() {
    this.checkNetwork();
    this.getAuthorizedLogin();

  }
  getAuthorizedLogin() {
    this.setState({ isLoading: true });
    let accessKey = HttpHelper(AccessUrl, 'GET');
    accessKey.then((response) => {
      if (response.status === 'true') {
        accessKeyData = response;
        AsyncStorage.setItem(
          'accessKey',
          JSON.stringify(accessKeyData),
          (err) => {
            AsyncStorage.getItem('user', (err, result) => {
              if (result != null) {
                var user = JSON.parse(result);
                if (user && user.status === 'true') {
                  if (user.user.email != '' && user.user.email != null) {
                    if (
                      user.user.password != '' &&
                      user.user.password != null
                    ) {
                      this.checkLogin(user, accessKeyData);
                    } else {
                      this.gotoLogin();
                    }
                  } else {
                    this.setState({
                      isLoggedIn: false,
                      isLoggedinState: 1,
                      isLoading: false,
                    });
                    this.gotoLogin();
                  }
                } else {
                  this.setState({
                    isLoggedIn: false,
                    isLoggedinState: 1,
                    isLoading: false,
                  });
                  this.gotoLogin();
                }
              } else {
                this.setState({
                  isLoggedIn: false,
                  isLoggedinState: 1,
                  isLoading: false,
                });
                this.gotoLogin();
              }
            });
          },
        );
      }
    });
  }

  checkLogin(data, value) {
    var loginData = {
      accesskey: value.key,
      username: data.user.email,
      password: data.user.password,
    };
    let auth = HttpHelper(
      LoginUrl +
      '?' +
      'accesskey' +
      '=' +
      loginData.accesskey +
      '&' +
      'loginname' +
      '=' +
      loginData.username +
      '&' +
      'loginpass' +
      '=' +
      loginData.password,
      'POST',
    );
    auth.then((response) => {
      if (response.status === 'true') {
        try {
          AsyncStorage.setItem('user', JSON.stringify(response), (err) => {
            this.setState({ isLoggedIn: true, isLoading: false }, () => {
              AsyncStorage.setItem('isLogin', JSON.stringify(this.state.isLoggedIn), (err) => {
                console.log(this.state.isLoggedIn, 'this.state.isLoggedIn');

              })
            });
            this.props.navigation.navigate('Home', { isText: true });
          });
        } catch (error) {
          this.gotoLogin();
        }
      } else {
        this.setState({
          isLoggedIn: false,
          isLoggedinState: 1,
          isLoading: false,
        }, () => {
          AsyncStorage.setItem('isLogin', JSON.stringify(this.state.isLoggedIn), (err) => {
            console.log(this.state.isLoggedIn, 'this.state.isLoggedIn');
          })

        });
        this.gotoLogin();
      }
    });
  }
  gotoLogin() {
    this.props.navigation.navigate('Landing');
  }

  checkNetwork() {
    const unsubscribe = NetInfo.addEventListener((state) => {
      this.props.navigation.setParams({
        isConnected: this.state.isConnected,
      });
      if (!state.isConnected) {
        this.setState({ isConnected: false });
        this.props.navigation.navigate('NoConnection', { isLoggedIn: this.state.isLoggedIn });
      } else {
        this.setState({ isConnected: true });
      }
    });
  }
  getMain() {
    const { isLoggedIn, isLoading } = this.state;

    if (isLoading) {

      return (
        <Modal transparent={true} visible={this.state.isLoading}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
              backgroundColor: Colors.mainBackground,
            }}>
            <ActivityIndicator color={Colors.buttonColor} size="large" />
          </View>
        </Modal>
      );
    } else {
      if (isLoggedIn) {
        return <Home navigation={this.props.navigation} isTest={true} />;
      } else {
        return <Login navigation={this.props.navigation} />;
      }
    }
  }
  activityLoading() {
    const { isLoading } = this.state;
    if (isLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            backgroundColor: Colors.placeholderColor,
          }}>
          <ActivityIndicator color={Colors.mainBackground} size="large" />
        </View>
      );
    }
  }
  componentWillUnmount() {
    if (DeviceInfo.getSystemName() != 'iOS') {
      // used only when "providerListener" is enabled
      // LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener.
    }
  }

  render() {
    return (
      <>
        <View style={{ flex: 1 }}>
          <ImageBackground
            resizeMode="cover"
            source={require('../assets/images/bg.png')}
            style={Styles.imageBg}>
            {this.activityLoading()}
          </ImageBackground></View>
      </>
    );
  }
}

export default Dash;
