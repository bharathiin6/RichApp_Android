import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  FlatList,
  TouchableOpacity, ActivityIndicator, Image, BackHandler
} from 'react-native';
import { Colors } from '../assets/styles/Colors';
import SecondaryHeader from '../components/SecondaryHeader';
import * as Animatable from 'react-native-animatable';
import { SettingStyle } from '../assets/styles/SettingStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import { LogoutUrl, NotificationsUrl,MyAccountUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper } from '../HelperApi/Api/HTTPHelper';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStyle } from '../assets/styles/AppStyle';
import { DrawerStyle } from '../assets/styles/DrawerStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';


var settingsInfo = [
  {
    id: 1,
    settingName: 'My Profile',
  },
  {
    id: 2,
    settingName: 'My Products',
  },
  {
    id: 3,
    settingName: 'Notifications',
  },
  {
    id: 4,
    settingName: 'Terms of Services',
  },
  {
    id: 5,
    settingName: 'Privacy Policy',
  },
];
class SettingScreen extends Component {
  constructor(props) {
    super(props);
    var params = this.props.route.params;
    this.state = {
      settingDetails: [],
      accessKeyDetails: {},
      isPressed: false,
      notificationLength: ''
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true, settingDetails: settingsInfo }, () => {

      this.getDetails();
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    })
  }
  handleBackPress = () => {
    this.props.navigation.push('Home')
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
        if (accessKeyDetails != null) {
          this.setState({
            accessKeyDetails: JSON.parse(accessKeyDetails),
            isLoading: true,
          }, () => {
            let notificationDetails = HttpHelper(
              NotificationsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
            notificationDetails.then((response) => {
              if (response.status === 'true') {
                var filterReadStatus = response.notification.filter(e => e.read === "N");
                if (filterReadStatus && filterReadStatus.length > 0) {
                  this.setState({
                    notificationLength: filterReadStatus.length
                  })
                }
              }
            })
          })
        }
      })
    }
  }
  getDetails = () => {
    AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
      if (accessKeyDetails != null) {
        this.setState({
          accessKeyDetails: JSON.parse(accessKeyDetails),
          isLoading: true,
        }, () => {
          let notificationDetails = HttpHelper(
            NotificationsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
          notificationDetails.then((response) => {
            if (response.status === 'true') {
              var filterReadStatus = response.notification.filter(e => e.read === "N");
              if (filterReadStatus && filterReadStatus.length > 0) {
                this.setState({
                  notificationLength: filterReadStatus.length
                })
              }
            }
          })
        })
      }
    })
    // AsyncStorage.getItem('user', (err, userDetails) => {
    //   if (userDetails != null) {
    //     const userInformation = JSON.parse(userDetails)
    //     console.log(userInformation,'userInformation');

    //     this.setState({
    //       daysText: userInformation.user.daystxt
    //     })
    //   }
    // })
    this.timers = setInterval(() => this.getMyAccount(), 1000)
  }
  getMyAccount = () => {
    let MyAccountDeatils = HttpHelper(
      MyAccountUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
    MyAccountDeatils.then((response) => {
      console.log(response,'responseresponse');
      if (response.status === 'true') {
        this.setState({
          daysText:response.user.daystxt
        })
      }
    });
  }
  _navigateToChild = (type) => {
    if (type === "My Profile") {
      this.props.navigation.navigate('ProfileScreen', { isSetting: true });
    }
    else if (type === "My Products") {
      this.props.navigation.navigate('MyProduct', { isSetting: true });
    } else if (type === "Notifications") {
      this.props.navigation.navigate('Notification', { isSetting: true });
    }
    else if (type === "Terms of Services") {
      this.props.navigation.navigate('TermsOfService', { isTerm: true, isSetting: true });
    }
    else if (type === "Privacy Policy") {
      this.props.navigation.navigate('TermsOfService', { isTerm: false, isSetting: true });
    }
  }

  _logout = async () => {
    this.setState({
      isPressed: true
    })
    const fcmToken = await messaging().getToken();
    if (this.state.accessKeyDetails && this.state.accessKeyDetails != null) {
      let logOut = HttpHelper(LogoutUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key + '&' + 'fcmkey' + '=' + fcmToken, 'GET');
      logOut.then(response => {
        this.setState({
          isPressed: false
        })
        if (response && response.status === "true") {
          this.setState({
            isPressed: false
          })
          try {
            AsyncStorage.removeItem('accessKey', (err) => {
              AsyncStorage.removeItem('user', (err) => {
                AsyncStorage.removeItem('notificationDetails', (err) => {
                  AsyncStorage.removeItem('isLogin', (err) => {
                    this.props.navigation.push('Landing');
                  });
                });
              });
            });
          } catch (error) { }
        }
      })
    }
  };
  _renderSectorItem = (item) => {
    return (
      <Animatable.View
        animation="zoomIn"
        duration={1200}
        style={SettingStyle.animateView}>
        <TouchableOpacity onPress={() => {
          this._navigateToChild(item.settingName)
        }} >
          <View style={[SettingStyle.animationText]}>
            {
              (this.state.notificationLength && item.settingName === "Notifications") ? <Text style={SettingStyle.contentAnimateView}>
                {item.settingName}<Image
                  style={[DrawerStyle.drawerImage, { height: 20 }]}
                  resizeMode="contain"
                  source={require('../assets/images/icons/notificationRed.png')}
                />
              </Text> : (this.state.notificationLength == '' && item.settingName === "Notifications") ?
                <Text style={SettingStyle.contentAnimateView}>
                  {item.settingName}<FontAwesome
                    name="bell-o"
                    size={20}
                    color={Colors.bellColor}></FontAwesome>
                </Text> : <Text style={SettingStyle.contentAnimateView}>
                  {item.settingName}</Text>
            }

            <Text style={SettingStyle.contentSubpayText}>
              <FontAwesome
                name="long-arrow-right"
                size={25}
                color={Colors.darkTextColor}
                style={{ width: 33, padding: 10 }}
              />
            </Text>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };
  _onNavigate = () => {
    this.props.navigation.navigate('Home');
  }
  render() {
    return (
      <>
        <StatusBar
          backgroundColor={Colors.mainBackground}
          barStyle="light-content"
        />
        <SafeAreaView backgroundColor={Colors.mainBackground}>
          {/* <SecondaryHeader title="Settings" navigation={this.props.navigation} /> */}
          <View style={AppStyle.secondaryHeaderStyle}>
            <View style={AppStyle.headerContainer}>
              <TouchableOpacity
                style={AppStyle.headerLeft}
                onPress={() => this.props.navigation.push('Home')}>
                <AntDesign
                  style={{ height: 30, alignSelf: 'center' }}
                  name="arrowleft"
                  color={Colors.lightWhiteColor}
                  size={30}
                />
              </TouchableOpacity>
              <Text numberOfLines={1} style={AppStyle.secondaryHeaderTitle}>{"Settings"}</Text>
              <TouchableOpacity style={{ width: 40 }}></TouchableOpacity>

            </View>
          </View>
          <ScrollView style={SettingStyle.settingsContainer} contentInsetAdjustmentBehavior="automatic">
            <View>
              <Animatable.Image
                animation="bounceIn"
                duration={1500}
                style={AppStyle.logoImage}
                source={require('../assets/images/logo.png')}
              />
              <Text style={{ alignSelf: 'center', fontFamily: 'Poppins-Medium', fontSize: 21, color: Colors.buttonColor, marginVertical: 10 }}>{this.state.daysText ? this.state.daysText : ''}</Text>
              {this.state.settingDetails && this.state.settingDetails.length > 0 && (
                <FlatList
                  style={{ paddingHorizontal: 10 }}
                  keyExtractor={(item, index) => item.id}
                  renderItem={({ item }) => this._renderSectorItem(item)}
                  data={this.state.settingDetails}
                />
              )}
              <TouchableOpacity
                onPress={() => {
                  this._logout()
                }}
                style={SettingStyle.logoutButton}>
                {this.state.isPressed ? (
                  <ActivityIndicator size="large" color={Colors.mainBackground} />
                ) : (
                  <Text style={SettingStyle.logOutText}>Log Out</Text>)}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

export default SettingScreen;
