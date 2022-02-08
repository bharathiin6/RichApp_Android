import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList, TextInput,
  Modal, ActivityIndicator, Dimensions, BackHandler, Alert, LayoutAnimation, Animated, VirtualizedList, Image, SectionList, Linking
} from 'react-native';
import { AppStyle } from '../assets/styles/AppStyle';
import { Colors } from '../assets/styles/Colors';
import * as Animatable from 'react-native-animatable';
import SplashScreen from 'react-native-splash-screen';
import { GCMRegistrationUrl, HomeUrl, AllProductUrl, AddProductsDetailsUrl, SearchProductUrl, NotificationsUrl, MyAccountUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper } from '../HelperApi/Api/HTTPHelper';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
const { width, height } = Dimensions.get('screen');
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import CheckBox from 'react-native-check-box';
import { FilterStyle } from '../assets/styles/FilterStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FastImage from 'react-native-fast-image';
import PushNotification, { Importance } from 'react-native-push-notification';
// import { Image } from 'react-native-elements';

// var PushNotification = require('react-native-push-notification');
const slideAnimation = new SlideAnimation({
  slideFrom: 'right',
});

var getCatProdId = [];
var catBoolPropVal = "";
var selectedSubId = [];
var getSudProdId = [];
var getSubBoolId = [];
var subBollPropVal = '';
var selectSub = '';
var getSubId = '';
var getCatId = '';
var selectCat = '';
var selectedCatId = [];
var getCatBoolId = [];
var getCatBoolValue = [];
var getSubCatBoolValue = [];
var catBooldata = '';
var subCatBooldata = '';
var SelectedCatList = [];
var count = 0;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    var params = this.props.route.params;
    this.state = {
      productData: [],
      accessKeyDetails: {},
      allProductData: [],
      isLoading: false,
      searchKeyword: '',
      isCloseSearch: false,
      categoryId: '',
      subCategoryId: '',
      dialogShow: false,
      propertyDetails: [],
      categoryDetails: [],
      catProperty: [],
      isPressed: false,
      pageKey: 1,
      isBackHandler: params && params.isBackHandler ? params.isBackHandler : false,
      isFilter: false,
      enableScrollViewScroll: true,
      isNavigateSearch: false,
      isProductDetails: params && params.isProductDetails ? params.isProductDetails : false,

    }
    this.getDetails = this.getDetails.bind(this);
  }
  componentDidMount() {
    SplashScreen.hide();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.getDetails();
    this.PushNotification();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.getDetails();
      this.PushNotification();

      this.setState({
        isProductDetails: nextProps && nextProps.isProductDetails ? nextProps.isProductDetails : false,
      })

    }
  }

  handleBackPress = () => {
    this.setState({
      dialogShow: false
    })
    Alert.alert(
      'Exit App',
      'Are you want to Exiting the application?', [{
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }, {
        text: 'OK',
        onPress: () => BackHandler.exitApp()
      },], {
      cancelable: false
    }
    )
    return true;
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.popupDialog = null
  }
  getDetails() {
    AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
      if (accessKeyDetails != null) {
        AsyncStorage.getItem('user', (err, userDetails) => {
          console.log(userDetails,'useruseruseruser');
          if (userDetails != null) {
            const userInformation = JSON.parse(userDetails)
            this.setState({
              accessKeyDetails: JSON.parse(accessKeyDetails),
              isLoading: true,
              userDetails: userInformation,
              webLink: userInformation && userInformation.user ? userInformation.user.weblink : ''
            }, () => {
              if (this.state.accessKeyDetails) {
                this.getFcmToken(this.state.accessKeyDetails);
                this.fetchProductDetails(this.state.accessKeyDetails)
                let notificationDetails = HttpHelper(
                  NotificationsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
                notificationDetails.then((response) => {
                  if (response.status === 'true') {
                    var filterReadStatus = response.notification.filter(e => e.read === "N");
                    if (filterReadStatus && filterReadStatus.length > 0) {
                      try {
                        AsyncStorage.setItem('notificationDetails', JSON.stringify(filterReadStatus), (err) => {
                        });
                      } catch (error) {
                      }
                    }
                  }
                });
                let propertyDetails = HttpHelper(
                  AddProductsDetailsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
                propertyDetails.then((response) => {
                  if (response.status === 'true') {
                    this.setState({
                      propertyDetails: response,
                      isLoading: false,
                      categoryDetails: response.Category
                    }, () => {
                      if (response.Category) {
                        response.Category.map(val => {
                          val.isSelected = false
                          val.catproperty.map(data => {
                            data.isSelectCat = false
                          })
                          val.subcat.map(value => {
                            value.isSelectSub = false
                          })
                        })
                      }
                    })
                  } else {
                    this.setState({
                      propertyDetails: [],
                      isLoading: false
                    })
                  }
                });
                let allProductDetail = HttpHelper(
                  AllProductUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key,
                  'POST',
                );
                allProductDetail.then((response) => {
                  if (response.status === 'true') {
                    this.setState({ allProductData: response.Products, isLoading: false })
                  } else {
                    this.setState({ allProductData: [], isLoading: false })
                  }
                });
              }

            });
          }
        })
      }
    });
  }

  PushNotification() {
    /* * Triggered when a particular notification has been received in foreground * */
    var fcmToken = '';
    PushNotification.configure({

      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token)
        fcmToken = token
      },
      // (required) Called when a remote or local notification is opened or received
      // onNotification: function (notification) {
      //   console.log('REMOTE NOTIFICATION ==>', notification)
      //   // process the notification here
      // },

      onNotification: notification => {
        console.log(notification);
        if (notification.action === "Take") {
          //do something here
        } else if (notification.action === "Skip") {
          //do something here
        } else if (notification.action === "Snooze") {
          //do something here
        }
        if (notification.foreground) {
          PushNotification.localNotification({
            title: notification.title,
            message: notification.message
          });
        }
      },
      // Android only: GCM or FCM Sender ID
      senderID: '778706497441',
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true,
      requestPermissions: true
    })
    messaging().onMessage((message) => {
      if (message) {
        console.log(message, 'messagemessage');
        PushNotification.localNotification({
          id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
          title: message.notification.title, // (optional)
          message: message.notification.body,
          userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
          playSound: false, // (optional) default: true
          soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          repeatTime: 3000,
          ignoreInForeground: false,
          messageId: message.messageId,
        });
        // PushNotification.cancelLocalNotifications({id: messageId});
      }
    });
    /* * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:  * */
    this.notificationOpenedListener = messaging().onNotificationOpenedApp(
      (notification) => {
        if (notification.data) {
          if (notification.data.message) {
            const body = JSON.parse(
              notification.data.message
            )
            if (body) {
              if (body.type === "Chat") {
                this.props.navigation.push('Notification')
              } else {
                this.props.navigation.push('Notification');
              }
            }
          }
        }
      },
    );

    /* * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:  * */
    messaging()
      .getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          if (notificationOpen.notification) {
            if (notificationOpen.notification) {
              this.props.navigation.push('Notification');
            }
          } else {
            this.props.navigation.push('HomeScreen');
          }
        }
      });
  }

  fetchProductDetails = (keyDetails) => {
    if (keyDetails) {
      let homeDetail = HttpHelper(
        HomeUrl + 'accesskey' + '=' + keyDetails.key + '&' + 'searchword' + '=' + this.state.searchKeyword + '&' + 'pagekey' + '=' + this.state.pageKey,
        'POST',
      );
      homeDetail.then((response) => {
        const productDetails = this.state.productData
        if (response.status === 'true') {
          if (this.state.isSearch) {
            this.setState({
              productData: response.Products, isLoading: false, isSearch: true, isNavigateSearch: true
            })
          } else {
            this.setState({
              productData: productDetails.concat(response.Products), isLoading: false
            })
          }
        } else {
          this.setState({
            isLoading: false
          })
        }
      });
    }
  }
  getFcmToken = async accsessKey => {
    if (accsessKey) {
      const fcmToken = await messaging().getToken();
      console.log(fcmToken,'fcmToken');
      if (fcmToken) {
        var deviceDetails = {
          accesskey: accsessKey.key,
          deviceType: DeviceInfo.getSystemName(),
          deviceUniqueId: DeviceInfo.getUniqueId(),
          deviceRegistrationId: fcmToken,
        };
        let deviceRegistrationDetails = HttpHelper(
          GCMRegistrationUrl +
          'accesskey' +
          '=' +
          deviceDetails.accesskey +
          '&' +
          'gcmkey' +
          '=' +
          deviceDetails.deviceRegistrationId,
          'GET',
        );
        deviceRegistrationDetails.then(response => {
          if (response && response.status) {
          }
        });
      } else {
        console.log('Failed', 'No token received');
      }
    }
  };
  onChangeMainCategory = (item) => {
    var finalFilter = []
    this.setState({
      activeMainButtonId: item.id
    })
    if (item.isSelected != undefined) {
      item.isSelected = !item.isSelected;
      if (item.isSelected === true) {
        selectedCatId.push(item);
      } else if (item.isSelected === false) {
        var data = this.state.categoryDetails.filter(data => data.id === item.id);
        if (data) {
          data.map(e => {
            e.subcat.map(sub => {
              sub.isSelectSub = false
              sub.subpropvalues.map(item => {
                if (item.Type === "Dropdown List") {
                  item.propvalues.map(prop => {
                    prop.isChecked = false
                  })
                }
                if (item.Type === "Boolean") {
                  item.propvalues.map(props => {
                    props.isChecked = false
                  })
                }
              })
            })
            e.catproperty.map(cat => {
              cat.isSelectCat = false
              cat.propvalues.map(chd => {
                chd.isChecked = false
              })
            })
          })
        }
        const i = selectedCatId.indexOf(item)
        if (i != -1) {
          selectedCatId.splice(i, 1)
        }
      }
    }
  }

  _renderHeader = (item) => {
    return (
      <>

        <TouchableOpacity key={item.id} onPress={() => this.onChangeMainCategory(item)}>
          <Animatable.View key={item.id}
            animation="zoomIn"
            duration={1200}
            style={FilterStyle.animateView}>
            <View style={{ width: width / 2 - 50 }}>
              <Text style={FilterStyle.accordianText}>{item.title}</Text>
            </View>
            <View style={{ width: 50, justifyContent: 'center', alignSelf: 'center' }}>
              <FontAwesome
                name={(item && item.isSelected) ? "check-square-o" : 'square-o'}
                style={AppStyle.iconShadow}
                size={30}
                color={Colors.buttonColor}
              />
            </View>

          </Animatable.View>
        </TouchableOpacity>
        {item && item.isSelected && (
          <>
            <Animatable.View key={item.id}
              animation="zoomIn"
              duration={1200}
              style={FilterStyle.contentAnimateView}>
              <View>
                <FlatList
                  listKey={(item, index) => item.id}
                  data={item.catproperty}
                  extraData={this.state}
                  renderItem={({ item }) => this._renderCatHeader(item)}
                />
              </View>
            </Animatable.View>
            <Animatable.View
              animation="zoomIn"
              duration={1200}
              style={FilterStyle.contentAnimateView}>
              <FlatList
                listKey={(item, index) => item.subcat.id}
                data={item.subcat}
                keyExtractor={(item, index) => item.id}
                extraData={this.state}
                renderItem={({ item }) => this._renderSubHeader(item)}
              />
              <View style={FilterStyle.borderView}></View>
            </Animatable.View>
          </>
        )}
      </>
    );
  };
  _renderCatHeader = (item) => {
    return (
      <>
        {(item.Type === "Dropdown List" || item.Type === "Boolean") && (
          <TouchableOpacity onPress={() => this.onChangeHandle(item)}>
            <Animatable.View key={item.id}
              animation="zoomIn"
              duration={1200}
              style={FilterStyle.animateView}>
              <View style={{ width: width / 2 - 50 }}>
                <Text style={FilterStyle.accordianText}>{item.title}</Text>
              </View>
              <View style={{ width: 50, justifyContent: 'center', alignSelf: 'center' }}>
                <FontAwesome
                  // name={this.state.activeButtonId === item.id? "check-square-o" : 'square-o'}
                  name={(item && item.isSelectCat) ? "check-square-o" : 'square-o'}

                  style={AppStyle.iconShadow}
                  size={30}
                  color={Colors.buttonColor}
                />
              </View>

            </Animatable.View>
          </TouchableOpacity>)}
        {item && item.isSelectCat &&
          <Animatable.View key={item.id}
            animation="zoomIn"
            duration={1200}
            style={FilterStyle.contentAnimateView}>
            <>
              {item.Type === "Dropdown List" &&
                <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10, fontFamily: 'Poppins-Medium' }}>
                  {item.title}
                </Text>
              }
              {item.Type === "Boolean" &&
                <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10, fontFamily: 'Poppins-Medium' }}>
                  {item.title}
                </Text>
              }
              {item.Type === "Dropdown List" && (
                <View>
                  {item.propvalues.map((data, index) => {
                    // listData.push(data)
                    if (data.hasOwnProperty('isChecked')) {
                      data.isChecked = data.isChecked
                    } else {
                      data.isChecked = false
                    }
                    return (
                      <CheckBox
                        style={FilterStyle.checkBoxView}
                        onClick={() => {
                          // var filterCatIndex = listData.filter((e) => e.value === data.value);
                          // if (filterCatIndex && filterCatIndex.length > 0) {
                          if (item.propvalues[index].isChecked) {
                            item.propvalues[index].isChecked = false
                          } else {
                            item.propvalues[index].isChecked = true
                          }
                          getCatProdId = item.propvalues.filter(e => e.isChecked === true);
                          this.forceUpdate()
                          // }
                        }}
                        checkedImage={<FontAwesome
                          name={"check-square-o"}
                          style={AppStyle.iconShadow}
                          size={30}
                          color={Colors.buttonColor}
                        />
                        }
                        unCheckedImage={<FontAwesome
                          name={'square-o'}
                          style={AppStyle.iconShadow}
                          size={30}
                          color={Colors.buttonColor}
                        />}
                        isChecked={data.isChecked}
                        rightText={data.title}
                        value={data.value}
                        key={index}
                        rightTextStyle={{ fontFamily: 'Poppins-Medium' }}
                      />
                    )
                  })}
                  <Text style={{
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.placeholderColor,
                    marginHorizontal: 10,
                  }}></Text>
                </View>
              )}
              {item.Type === "Boolean" &&
                (
                  <View>
                    {item.propvalues.map((val, index) => {
                      if (val.hasOwnProperty('isChecked')) {
                        val.isChecked = val.isChecked
                      } else {
                        val.isChecked = false
                      }
                      return (
                        <CheckBox
                          style={FilterStyle.checkBoxView}
                          onClick={() => {
                            if (item.propvalues[index].isChecked) {
                              item.propvalues[index].isChecked = false
                            } else {
                              item.propvalues[index].isChecked = true
                            }
                            getCatBoolId = item.propvalues.filter(e => e.isChecked === true);
                            getCatBoolValue.push({ 'id': item.id })
                            this.forceUpdate()
                          }}
                          checkedImage={<FontAwesome
                            name={"check-square-o"}
                            style={AppStyle.iconShadow}
                            size={30}
                            color={Colors.buttonColor}
                          />
                          }
                          unCheckedImage={<FontAwesome
                            name={'square-o'}
                            style={AppStyle.iconShadow}
                            size={30}
                            color={Colors.buttonColor}
                          />}
                          isChecked={val.isChecked}
                          rightText={val.value}
                          value={val.value}
                          key={val.value}
                          rightTextStyle={{ fontFamily: 'Poppins-Medium' }}
                        />)
                    })}
                    <Text style={{
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.placeholderColor,
                      marginHorizontal: 10,
                    }}></Text>
                  </View>)
              }
              {item.Type === "Text" &&
                <View></View>
              }
            </>
          </Animatable.View>
        }
      </>
    )
  };

  onChangeHandle = (item) => {
    this.setState({
      activeButtonId: item.id
    })
    if (item.isSelectCat != undefined) {
      item.isSelectCat = !item.isSelectCat;
      if (item.isSelectCat === true) {
        var catData = [];
        SelectedCatList.push(item);
      } else if (item.isSelectCat === false) {
        this.state.categoryDetails.map(e => {
          catData = e.catproperty.filter(e => e.id === item.id)
          if (catData) {
            catData.map(value => {
              value.propvalues.map(chd => {
                chd.isChecked = false
              })
            })
          }
        });
        const i = SelectedCatList.indexOf(item)
        if (i != -1) {
          SelectedCatList.splice(i, 1)
        }
      }

    }
  }

  onChangeHandleSub = (item) => {
    var subData = []
    this.setState({
      activeButtonSubId: item.id
    })
    item.isSelectSub = !item.isSelectSub;
    if (item.isSelectSub === true) {
      selectedSubId.push(item);
    } else if (item.isSelectSub === false) {

      this.state.categoryDetails.map(e => {
        subData = e.subcat.filter(e => e.id === item.id)
        if (subData) {
          subData.map(value => {
            value.subpropvalues.map(subpropvalues => {
              subpropvalues.propvalues.map(unChk => {
                unChk.isChecked = false
              })
            })
          })
        }
      });

      const i = selectedSubId.indexOf(item)
      if (i != -1) {
        selectedSubId.splice(i, 1)
      }
    } else {
      selectedSubId = [];
    }

  }
  _renderSubHeader = (item, index, isActive) => {
    return (
      <>
        <TouchableOpacity onPress={() => { this.onChangeHandleSub(item) }}>
          <Animatable.View key={item.id}
            animation="zoomIn"
            duration={1200}
            style={FilterStyle.animateView}>
            <View style={{ width: width / 2 - 50 }}>
              <Text style={FilterStyle.accordianText}>{item.title}</Text>

            </View>
            <View style={{ width: 50, justifyContent: 'center', alignSelf: 'center' }}>
              <FontAwesome
                name={(item && item.isSelectSub) ? "check-square-o" : 'square-o'}
                style={AppStyle.iconShadow}
                size={30}
                color={Colors.buttonColor}
              />
            </View>


          </Animatable.View>
        </TouchableOpacity>
        {item && item.isSelectSub &&
          <Animatable.View key={item.id}
            animation="zoomIn"
            duration={1200}
            style={FilterStyle.contentAnimateView}>
            {item.subpropvalues.map((data, index) => {
              return (
                <>
                  {data.Type === "Dropdown List" &&
                    <Text style={{ fontSize: 16, margin: 10, fontFamily: 'Poppins-Medium' }}>
                      {data.title}
                    </Text>
                  }
                  {data.Type === "Boolean" &&
                    <Text style={{ fontSize: 16, margin: 10, fontFamily: 'Poppins-Medium' }}>
                      {data.title}
                    </Text>
                  }
                  {data.Type === "Dropdown List" && (
                    <View>
                      {data.propvalues.map((val, index) => {
                        if (val.hasOwnProperty('isChecked')) {
                          val.isChecked = val.isChecked
                        } else {
                          val.isChecked = false
                        }
                        return (
                          <CheckBox
                            style={FilterStyle.checkBoxView}
                            onClick={() => {
                              var filterIndex = data.propvalues.filter((e) => e.value === val.value);
                              if (filterIndex && filterIndex.length > 0) {
                                if (data.propvalues[index].isChecked) {
                                  data.propvalues[index].isChecked = false
                                } else {
                                  data.propvalues[index].isChecked = true
                                }
                                getSudProdId = data.propvalues.filter(e => e.isChecked === true)
                                this.forceUpdate()
                              }
                            }}
                            checkedImage={<FontAwesome
                              name={"check-square-o"}
                              style={AppStyle.iconShadow}
                              size={30}
                              color={Colors.buttonColor}
                            />
                            }
                            unCheckedImage={<FontAwesome
                              name={'square-o'}
                              style={AppStyle.iconShadow}
                              size={30}
                              color={Colors.buttonColor}
                            />}
                            isChecked={val.isChecked}
                            rightText={val.title}
                            value={val.id}
                            key={index}
                            rightTextStyle={{ fontFamily: 'Poppins-Medium' }}
                          />
                        )
                      })}
                      <Text style={{
                        borderBottomWidth: 1,
                        borderBottomColor: Colors.placeholderColor,
                        marginHorizontal: 10,
                      }}></Text>
                    </View>
                  )
                  }
                  {data.Type === "Boolean" &&
                    (
                      <View>
                        {data.propvalues.map((val, index) => {
                          if (val.hasOwnProperty('isChecked')) {
                            val.isChecked = val.isChecked
                          } else {
                            val.isChecked = false
                          }
                          return (
                            <CheckBox
                              style={FilterStyle.checkBoxView}
                              onClick={() => {
                                if (data.propvalues[index].isChecked) {
                                  data.propvalues[index].isChecked = false
                                } else {
                                  data.propvalues[index].isChecked = true
                                }
                                getSubBoolId = data.propvalues.filter(e => e.isChecked === true);
                                getSubCatBoolValue.push({ "id": data.id })
                                this.forceUpdate()
                              }}
                              checkedImage={<FontAwesome
                                name={"check-square-o"}
                                style={AppStyle.iconShadow}
                                size={30}
                                color={Colors.buttonColor}
                              />
                              }
                              unCheckedImage={<FontAwesome
                                name={'square-o'}
                                style={AppStyle.iconShadow}
                                size={30}
                                color={Colors.buttonColor}
                              />}
                              isChecked={val.isChecked}
                              rightText={val.value}
                              value={val.value}
                              key={val.value}
                              rightTextStyle={{ fontFamily: 'Poppins-Medium' }}
                            />)
                        })}
                        <Text style={{
                          borderBottomWidth: 1,
                          borderBottomColor: Colors.placeholderColor,
                          marginHorizontal: 10,
                        }}></Text>

                      </View>)
                  }
                  {data.Type === "Text" &&
                    <View></View>
                  }
                </>
              )
            })}
          </Animatable.View>}
      </>
    );
  };

  onFilter = () => {
    this.setState({
      isPressed: true
    })
    var filterSelectedCatId = [];
    var filterSelectedSubId = [];
    var filterSelectedCatProp = [];
    getCatId = '';
    getSubId = '';
    selectSub = '';
    selectCat = '';
    subBollPropVal = '';
    catBoolPropVal = '';
    catBooldata = '';
    subCatBooldata = '';
    if (selectedCatId) {
      selectedCatId.map(e => {
        if (e.isSelected) {
          if (getCatId != "") {
            getCatId = getCatId + "," + e.id;
          } else {
            getCatId = e.id
          }
        }
      })
    } else {
      selectedCatId = [];
      getCatId = '';
    }
    if (selectedSubId) {
      selectedSubId.forEach(obj => {
        if (!filterSelectedSubId.some(o => o.id === obj.id)) {
          filterSelectedSubId.push({ ...obj })
        }
      });
      filterSelectedSubId.map(e => {
        if (e.isSelectSub) {
          if (getSubId != "") {
            getSubId = getSubId + "," + e.id;
          } else {
            getSubId = e.id
          }
        }
      })
    } else {
      selectedSubId = [];
      getSubId = '';
    }
    if (getSudProdId && getSudProdId.length > 0) {
      getSudProdId.map(e => {
        if (e.isChecked) {
          if (selectSub != "") {
            selectSub = selectSub + "," + e.value;
          } else {
            selectSub = e.value
          }
        }
      })
    }
    if (getCatProdId && getCatProdId.length > 0) {
      getCatProdId.forEach(obj => {
        if (!filterSelectedCatProp.some(o => o.value === obj.value)) {
          filterSelectedCatProp.push({ ...obj })
        }
      });
      filterSelectedCatProp.map(e => {
        if (e.isChecked) {
          if (selectCat != "") {
            selectCat = selectCat + "," + e.value;
          } else {
            selectCat = e.value
          }
        }
      })
    }
    if (getSubBoolId) {
      getSubBoolId.map(e => {
        if (e.value === "True") {
          if (getSubCatBoolValue) {
            getSubCatBoolValue.map(e => {
              if (e.isChecked) {
                if (subBollPropVal != "") {
                  subBollPropVal = e.id;
                } else {
                  subBollPropVal = e.id
                }
              }
            })
          }
        } else {
          if (getSubCatBoolValue) {
            getSubCatBoolValue.map(e => {
              if (subCatBooldata != "") {
                subCatBooldata = e.id;
              } else {
                subCatBooldata = e.id
              }
            })
          }
        }
      })
    }

    if (getCatBoolId) {
      getCatBoolId.map(e => {
        if (e.value === "True") {
          if (getCatBoolValue) {
            getCatBoolValue.map(item => {
              if (item.isChecked) {
                if (catBooldata != "") {
                  catBooldata = item.id
                } else {
                  catBooldata = item.id
                }
              }
            })
          }
        } else {
          if (getCatBoolValue) {
            getCatBoolValue.map(val => {
              if (catBoolPropVal != "") {
                catBoolPropVal = val.id
              } else {
                catBoolPropVal = val.id
              }
            })
          }
        }
      })
    }

    var data = {
      'accesskey': this.state.accessKeyDetails.key,
      'mcatid': getCatId,
      'scatid': getSubId,
      'mcatpropv': selectCat ? selectCat : '',
      'scatpropv': selectSub ? selectSub : '',
      'searchprod': this.state.searchKeyword ? this.state.searchKeyword : "",
      'catbol': catBooldata ? catBooldata : '',
      'catbolf': catBoolPropVal ? catBoolPropVal : '',
      'subcatbol': subBollPropVal,
      'subcatbolf': subCatBooldata
    }
    let filterProdut = HttpHelper(SearchProductUrl
      + 'accesskey' + '=' + data.accesskey + '&' +
      'mcatid' + '=' + data.mcatid + '&' + 'scatid' + '=' +
      data.scatid + '&' + 'mcatpropv' + '=' + data.mcatpropv + '&' + 'scatpropv' + '=' + data.scatpropv +
      '&' + 'searchprod' + '=' + data.searchprod + '&' + 'catbol' + '=' + data.catbol + '&' + 'catbolf' + '=' + data.catbolf + '&' + 'subcatbol' + '=' + data.subcatbol + '&' + 'subcatbolf' + '=' + data.subcatbolf, 'POST');
    filterProdut.then((response) => {
      this.setState({
        isPressed: false
      })
      if (response && response.status === 'true') {
        this.setState({
          productData: response.Products,
          dialogShow: false,
          isPressed: false,
          isSearch: true,
          isFilter: true,
          isClearFilter: true,
        })
      }
    })
  }
  closeModal() {
    this.setState({ dialogShow: false });
  }
  openModal() {
    this.setState({ dialogShow: true, isEnable: true });
  }
  onNavigateDetails = (item) => {
    count = count + 1;
    this.props.navigation.push('ProductDetails', { getProductDetails: item });
    if (count >= 1) {
      this._clearFilter()
    }
  }
  _renderSectorItem = (item) => {
    const badge = item.badge === 'Y' ? true : false;
    return (
      <>

        <Animatable.View key={item.id}
          animation="zoomIn"
          duration={1200}
          style={[AppStyle.renderView, {
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.65,
            shadowRadius: 8,
            elevation: 10
          }]}>
          <TouchableOpacity style={{ width: 160 }}
            onPress={() => {
              this.onNavigateDetails(item)
            }}>
            {item.image ?
              <Image
                source={{ uri: item.image }}
                style={[{
                  width: 140,
                  height: 150,
                  margin: 10,
                }]}
                PlaceholderContent={<ActivityIndicator size="small" color={Colors.mainBackground} style={{ marginTop: 100 }} />}
              /> :
              <Image
                source={{ uri: 'https://icon-library.net/images/no-picture-available-icon/no-picture-available-icon-1.jpg' }}
                style={[{
                  width: 140,
                  height: 150,
                  margin: 10,
                }]}
                PlaceholderContent={<ActivityIndicator />}
              />
            }
            <View style={{ height: 50 }}>
              <Text numberOfLines={2}
                style={[
                  AppStyle.categoryText,
                  {
                    fontFamily: 'Poppins-Bold',
                    // paddingHorizontal: 10,
                    marginTop: 20,
                    fontSize: 16,
                    maxWidth: 150
                  },
                ]}>
                {item.title ? item.title : ''}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, }}>
              <Text
                style={[
                  AppStyle.categoryText,
                  {
                    fontFamily: 'Poppins-Bold',
                    // paddingHorizontal: 10,
                    top: 15,
                    color: Colors.textColor,
                    fontSize: 16,

                  },
                ]}>
                {'PLN'} {item.price ? item.price : ''}
              </Text>
              {badge && (
                <Image
                  style={{ left: -20, height: 35, width: '15%', top: 10 }}
                  resizeMode="contain"
                  source={require('../assets/images/icons/offer.png')}
                />
              )}
            </View>
            <Text style={[
              AppStyle.categoryText,
            ]}></Text>

          </TouchableOpacity>
        </Animatable.View>
      </>
    );
  };
  addSearchText = (txt) => {
    this.setState({
      searchKeyword: txt
    });
  }
  _onClearSearch = () => {
    this.setState({
      searchKeyword: '',
      isCloseSearch: false,
      isSearch: false
    }, () => {
      this.getDetails()
    })
  }
  _onNavigateSearch = () => {
    if (this.state.searchKeyword) {
      this.setState({
        isCloseSearch: true,
        isSearch: true
      }, () => {
        this.getDetails()
      })
    }
  }
  _clearFilter = () => {
    this.setState({
      isClearFilter: false,
      isSearch: false
    }, () => {
      if (this.state.categoryDetails && this.state.categoryDetails.length > 0) {
        this.state.categoryDetails.map(val => {
          val.isSelected = false
          val.catproperty.map(data => {
            data.isSelectCat = false
            data.propvalues.map(val => {
              val.isChecked = false
            })
          })
          val.subcat.map(value => {
            value.isSelectSub = false
            value.subpropvalues.map(sub => {
              sub.propvalues.map(prop => {
                prop.isChecked = false
              })
            })
          })
        })
      }
      getCatProdId = [];
      selectedSubId = [];
      getCatBoolId = [];
      getSudProdId = [];
      getSubBoolId = [];
      getCatBoolValue = [];
      getSubCatBoolValue = [];
      selectedCatId = [];
      let homeDetail = HttpHelper(
        HomeUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key + '&' + 'searchword' + '=' + this.state.searchKeyword + '&' + 'pagekey' + '=' + this.state.pageKey,
        'POST',
      );
      homeDetail.then((response) => {
        this.setState({
          productData: response.Products
        })
      })

      // this.fetchProductDetails(this.state.accessKeyDetails)

    })
  }

  renderFooter = () => {
    return (
      <View style={{ marginTop: 10, alignSelf: 'center' }}>
        {(!this.state.isSearch && !this.state.isFilter && !this.state.isClearFilter) && (
          <ActivityIndicator size="large" color={Colors.mainBackground}></ActivityIndicator>
        )}
      </View>
    )
  }
  renderEmptyContainer = () => {
    return (
      <View style={{ marginTop: 10, alignSelf: 'center', justifyContent: 'center', marginTop: height / 4 }}>
        {(this.state.isSearch || this.state.isFilter || this.state.isClearFilter) && (
          <Text style={{
            fontFamily: 'Poppins-Medium', fontSize: 16, color: Colors.buttonColor
          }}>No Products</Text>
        )}
      </View>
    )
  }
  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
  };
  onEnableScroll = (value) => {
    this.setState({
      enableScrollViewScroll: value,
    });
  };

  render() {
    return (
      <>
        <StatusBar
          backgroundColor={Colors.lightTxtColor}
          barStyle="dark-content"
        />
        <SafeAreaView style={AppStyle.barStyle}>
          <Dialog
            animationType="fade"
            visible={this.state.dialogShow}
            onTouchOutside={() => {
              this.setState({ dialogShow: false });
            }}
            width={width - 40}
            height={height - 200}
            dialogStyle={{ backgroundColor: Colors.lightWhiteColor }}
            titleStyle={AppStyle.titleBar}
            ref={popupDialog => {
              this.popupDialog = popupDialog;
            }}
            dialogAnimation={new SlideAnimation({
              slideFrom: 'bottom',
            })}>
            <DialogContent>
              <ScrollView
                keyboardDismissMode={'interactive'}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}>
                <View style={[FilterStyle.accordianView, { flex: 1 }]}>
                  <View>
                    <FlatList
                      scrollEnabled
                      data={this.state.categoryDetails}
                      keyExtractor={(item, index) => index.toString()}
                      extraData={this.state}
                      renderItem={({ item }) => this._renderHeader(item)}
                      // ListFooterComponent={<View style={{ height: 50 }} />}
                      keyboardShouldPersistTaps={'handled'}
                      contentContainerStyle={{ padding: 18 }}
                    />
                  </View>
                  {((selectedCatId && selectedCatId.length > 0) || (selectedSubId && selectedSubId.length > 0) || (getSudProdId && getSudProdId.length > 0) || (getCatProdId && getCatProdId.length > 0) || (getSubBoolId && getSubBoolId.length > 0) || (getCatBoolId && getCatBoolId.length > 0)) &&
                    <TouchableOpacity onPress={() => { this.onFilter() }} style={AppStyle.applyButton}>
                      {this.state.isPressed ? (
                        <ActivityIndicator size="large" color={Colors.mainBackground} />
                      ) : (
                        <Text style={AppStyle.buttonText}>Apply</Text>
                      )}
                    </TouchableOpacity>
                  }
                </View>
                <View style={FilterStyle.accordianView}>
                </View>
              </ScrollView>
            </DialogContent>
          </Dialog>
          {/* <Header navigation={this.props.navigation} title={'Home'} isLoggedin={false} /> */}
          <View style={AppStyle.headerStyle}>
            <View style={AppStyle.headerContainer}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={AppStyle.headerLeft}
                  onPress={() => this.props.navigation.openDrawer()}>
                  <Ionicons
                    name={'ios-menu'}
                    style={AppStyle.iconShadow}
                    size={35}
                    color={Colors.buttonColor}
                  />
                </TouchableOpacity>
                <Image
                  resizeMode="contain"
                  source={require('../assets/images/text-logo.png')}
                  style={AppStyle.headerLogo}
                />
              </View>
              {/* <TouchableOpacity onPress={() => Linking.openURL(this.state.webLink)} style={AppStyle.heasderMedium}>
                <Image style={{ height: 30, width: 30 }} resizeMode={'contain'} source={require('../assets/images/icons/shop.png')} />
                <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium', alignSelf: 'center', paddingHorizontal: 5 }}>Subscription</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={AppStyle.headerRight}
                onPress={() => this.openModal()}>
                <FontAwesome5
                  name={'sliders-h'}
                  style={AppStyle.iconShadow}
                  size={25}
                />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent) && !this.state.isSearch) {
              this.setState({
                pageKey: this.state.pageKey + 1
              }, () => {
                this.fetchProductDetails(this.state.accessKeyDetails)
              })
            }
          }}

            style={AppStyle.mainContainer}
            contentInsetAdjustmentBehavior="automatic">
            <View style={[AppStyle.searchContainer]}>
              <TextInput placeholder="Search"
                placeholderTextColor={Colors.secondaryTextColor}
                returnKeyType="search"
                style={[AppStyle.searchInput, { fontFamily: 'Poppins-SemiBold' }]}
                onChangeText={this.addSearchText}
                defaultValue={this.state.searchKeyword}
                onSubmitEditing={(event) => this._onNavigateSearch(event)}
              />
              {this.state.isCloseSearch ?
                <TouchableOpacity onPress={() => { this._onClearSearch() }} style={{
                  justifyContent: 'center', left: -40, flex: 0.09, borderRadius: 30, borderColor: Colors.borderColor,
                  backgroundColor: Colors.borderColor,
                }}>
                  <View style={{ alignSelf: 'center' }}>
                    <Icon color={Colors.secondaryTextColor} size={18} name="close" />
                  </View>
                </TouchableOpacity> :
                <>
                  <TouchableOpacity onPress={() => { this._onNavigateSearch() }} style={{
                    justifyContent: 'center', left: -40, flex: 0.09, borderRadius: 30, borderColor: Colors.borderColor,
                    backgroundColor: Colors.borderColor,
                  }}>
                    <View style={{ alignSelf: 'center' }} >
                      <Icon color={Colors.secondaryTextColor} size={18} name="search" />
                    </View>
                  </TouchableOpacity>
                </>
              }
            </View>
            {this.state.isClearFilter && (
              <TouchableOpacity onPress={() => { this._clearFilter() }} style={{ alignSelf: 'flex-end', paddingHorizontal: 40, paddingTop: 20 }} >
                <View style={{ height: 30 }}>
                  <Text style={{ textDecorationLine: 'underline', fontFamily: 'Poppins-Bold', fontSize: 14, color: Colors.textColor }}>{"Clear All"}</Text>
                </View>
              </TouchableOpacity>
            )}
            {this.state.productData &&
              <View style={AppStyle.flatListView}>
                <FlatList
                  listKey={(item, index) => item.id}
                  style={{ alignSelf: 'center' }}
                  numColumns={2}
                  keyExtractor={(item, index) => item.id}
                  renderItem={({ item }) => this._renderSectorItem(item)}
                  data={this.state.productData}
                  ListFooterComponent={this.renderFooter}
                  disableVirtualization={false}
                  ListEmptyComponent={this.renderEmptyContainer}
                  contentContainerStyle={{ flex: 1 }}
                />
              </View>
            }
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}
// }

export default HomeScreen;