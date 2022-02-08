import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  FlatList,
  Dimensions, Modal, ActivityIndicator, Linking, BackHandler, Alert
} from 'react-native';
import { AppStyle } from '../assets/styles/AppStyle';
import { MyProductStyle } from '../assets/styles/MyProductStyle';
import { SettingStyle } from '../assets/styles/SettingStyle';
import { Styles } from '../auth/Styles';
import Icon from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from '../assets/styles/Colors';
import Header from '../components/Header';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SecondaryHeader from '../components/SecondaryHeader';
import Octicons from 'react-native-vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationsUrl, FirstChatUrl, MyAccountUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper } from '../HelperApi/Api/HTTPHelper';
const { width, height } = Dimensions.get('screen');
import Dialog from "react-native-dialog";
import { ProductStyle } from '../assets/styles/ProductStyle';
import FastImage from 'react-native-fast-image';
import { ConversationStyle } from '../assets/styles/ConversationStyle';
import moment from 'moment';


// var moment = require('moment'); // require


class Notification extends Component {
  constructor(props) {
    super(props);
    var params = this.props.route.params;
    this.state = {
      notificationDetails: [],
      isLoading: false,
      isRead: true,
      isHome: params && params.isHome ? params.isHome : false,
      dialogShow: false,
      popUpContentTitle: '',
      popUpContentMsg: '',
      isSetting: params && params.isSetting ? true : false,
      notificationMessage:''
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
            this.setState({ isLoading: true })
            if (response.status === 'true') {
              this.setState({
                notificationDetails: response.notification,
                isLoading: false,
                notificationLength: response.notification.length
              }, () => {
                if (this.state.notificationDetails) {
                  var filterReadStatus = this.state.notificationDetails.filter(e => e.read === "N");
                  if (filterReadStatus && filterReadStatus.length > 0) {
                  }
                }
                var asc = response.notification.sort(function (obj1, obj2) {
                  return obj2.id - obj1.id;
                });

              })
            } else {
              this.setState({
                notificationDetails: [],
                isLoading: false
              })
            }
          });
        });
      }
    });
  }
  getMyAccountData = () => {
    let MyAccountDeatils = HttpHelper(
      MyAccountUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
    MyAccountDeatils.then((response) => {
      if (response.status === 'true') {
        this.setState({
          webFlag: response.user.webflag === "True" ? true : false,
          webLink: response.user.weblink
        })
      }
    });}
  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      // this.timer = setInterval(()=> this.getDetails(), 4000)
      this.getDetails();
      this.timer = setInterval(() => this.getMyAccountData(), 1000)
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState({ isLoading: true }, () => {
        this.getDetails();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
      })
    }

  }
  handleBackPress = () => {
    if (this.state.isSetting) {
      this.props.navigation.goBack()
    } else {
      this.props.navigation.push('Home')
    }
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    clearInterval(this.timer)
    this.interval = 0;
    this.popupDialog = null
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
              console.log(response,'response');
              this.setState({ isLoading: true })
              if (response.status === 'true') {
                this.setState({
                  notificationDetails: response.notification,
                  isLoading: false,
                  notificationLength: response.notification.length,
                }, () => {
                  if (this.state.notificationDetails) {
                    var filterReadStatus = this.state.notificationDetails.filter(e => e.read === "N");
                    if (filterReadStatus && filterReadStatus.length > 0) {
                    }
                  }
                  var asc = response.notification.sort(function (obj1, obj2) {
                    return obj2.id - obj1.id;
                  });

                })
              } else {
                console.log(response.message,'response.message');
                this.setState({
                  notificationDetails: [],
                  isLoading: false,
                  notificationMessage :response.message
                })
              }
            });
          });
        }
      });
    }
  }
  _onNavigateHandle = (item) => {
    if (this.state.webFlag) {
      Linking.openURL(this.state.webLink)
      this.props.navigation.navigate('Home')

    } else {
      if (this.state.accessKeyDetails && item) {
        let notificationUpdate = HttpHelper(
          NotificationsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key + '&' + 'notifyid' + '=' + item.id, 'POST');
        notificationUpdate.then((response) => {
          if (response.status === 'true') {
            this.getDetails();
            if (item.type === "CHAT") {
              if (item.redirectid == "") {
                this.setState({
                  dialogShowChat: true,
                  productId: item.prodid,
                  notifyChatId: item.chatid,
                  chatDetails: item
                })
                // this.props.navigation.push("Conversation", { getChatDetails: item, notificationType: item.ntype, notifiChatId: item.redirectid, isNotifi: true })
              } else {
                this.props.navigation.push("ChatScreen", { getChatDetails: item, isSeller: item.ntype === "SEL" ? true : false, isAdmin: item.ntype === "ADMIN" ? true : false, isNotifi: true })
              }
            } else if (item.type === "PROD") {
              this.props.navigation.push("ProductDetails", { getProductDetails: item.prodid, isChat: true, isNotifi: true })
            } else if (item.type === "ADMIN") {
              if (item.contenttype === "Link") {
                Linking.openURL(item.msg)
              } else {
                this.setState({
                  dialogShow: true,
                  popUpContentTitle: item.title,
                  popUpContentMsg: item.msg,
                  dialogShowChat: false
                })
              }
            }
          }
        });
      }
    }
  }

  closeModal = () => {
    this.setState({ dialogShow: false, dialogShowChat: false });
  }



  _renderSectorItem = (item, index) => {
    var isRead = item.read === "Y" ? true : false;
    return (
      <>
        <Animatable.View
          animation="zoomIn"
          duration={1200}
        >
          <TouchableOpacity key={index} onPress={() => this._onNavigateHandle(item)}>
            <View style={MyProductStyle.animationText}>
              <View style={{ flexDirection: 'row' }}>
                {item.image ?
                  <FastImage
                    style={ConversationStyle.conversationImage}
                    source={{
                      uri: item.image ? item.image : null,
                      headers: { Authorization: 'token' },
                      priority: FastImage.priority.high
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  >
                    {/* <ActivityIndicator size="small" color={Colors.mainBackground} style={{ marginTop: 50 }} animating={this.state.loading} /> */}
                  </FastImage> :
                  <FastImage
                    style={ConversationStyle.conversationImage}
                    source={{
                      uri: 'https://icon-library.net/images/no-picture-available-icon/no-picture-available-icon-1.jpg',
                      headers: { Authorization: 'token' },
                      priority: FastImage.priority.high
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  >

                  </FastImage>
                }
                <View style={{ flexDirection: 'column', width: '60%' }}>
                  <Text numberOfLines={1} style={isRead ? [MyProductStyle.contentAnimateView, { color: Colors.textColor, fontWeight: 'bold' }] : [MyProductStyle.contentAnimateView, { color: Colors.mainBackground, fontWeight: 'bold' }]}>
                    {item.title}
                  </Text>
                  <Text numberOfLines={2} style={isRead ? [MyProductStyle.contentAnimateView, { color: Colors.textColor, fontWeight: 'bold' }] : [MyProductStyle.contentAnimateView, { color: Colors.mainBackground, fontWeight: 'bold' }]}>
                    {item.msg}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', top: 10 }}>
                    <Text style={[{ alignSelf: 'flex-start', paddingLeft: 10, fontWeight: 'bold', color: Colors.placeholderColor }]}>

                      {moment(item.date).format('D MMM YYYY')}{'   '}{moment(item.date).format('HH:mm ')}
                    </Text>
                    {/* <Text style={[{ alignSelf: 'flex-start', fontWeight: 'bold', color: Colors.placeholderColor }]}>
                      {moment(new Date().getTime()).format('HH:mm')}
                    </Text> */}
                  </View>
                </View>
              </View>
              <TouchableOpacity style={[{ justifyContent: 'center' }]}>
                <FontAwesome
                  name="chevron-right"
                  size={22}
                  color={Colors.buttonColor}
                />
              </TouchableOpacity>
              {!isRead &&
                <View style={[{ justifyContent: 'center', marginRight: 10 }]}>
                  <Octicons
                    name="primitive-dot"
                    style={AppStyle.iconShadow}
                    size={20}
                    color={Colors.buttonColor}
                  />
                </View>
              }

            </View>
          </TouchableOpacity>
          <Text style={{
            borderBottomWidth: 1,
            borderBottomColor: Colors.placeholderColor,
            marginHorizontal: 10,
          }}></Text>
        </Animatable.View>
      </>
    );
  };
  activateLoading = () => {
    if (this.state.isLoading) {
      return (
        <>
          <Modal transparent={true} visible={this.state.isLoading}>
            <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" color={Colors.mainBackground} />
            </View>
          </Modal>
        </>
      )
    }
  }
  handleChangename = (nickName) => {
    if (nickName) {
      this.setState({ nickName: nickName, errorNameMsg: false });
    } else {
      this.setState({ nickName: '', errorNameMsg: false })
    }
  };
  navigateToChild = () => {
    if (this.state.isSetting) {
      this.props.navigation.goBack();
    }
    else {
      this.props.navigation.push('Home');
    }
  }
  onChatNavigate = () => {
    const { nickName, productId, notifyChatId } = this.state;
    if (nickName == undefined) {
      this.setState({ errorNameMsg: true })
    } else {

      let firstChat = HttpHelper(
        FirstChatUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key +
        '&' +
        'prodid' +
        '=' +
        productId +
        '&' +
        'sellername' +
        '=' +
        nickName +
        '&' +
        'chatid' +
        '=' +
        notifyChatId,
        'GET',
      );
      firstChat.then(response => {
        if (response && response.status === "true") {
          this.setState({
            dialogShowChat: false
          }, () => {
            Alert.alert(
              '',
              response.Message,
              [
                {
                  text: 'OK', onPress: () => {
                    if (this.state.chatDetails) {
                      this.props.navigation.push("ChatScreen", { getChatDetails: this.state.chatDetails, isSeller: this.state.chatDetails.ntype === "SEL" ? true : false, isAdmin: this.state.chatDetails.ntype === "ADMIN" ? true : false, isNotifi: true })
                    }
                    // this.props.navigation.push("ChatScreen", { nickName: nickName, image: this.state.getItem, isSeller: true, productId: productId })
                  }
                },
              ],
              { cancelable: false }
            );
          })
        } else {
        }
      })
    }
  }
  render() {
    var notificationLength = this.state.notificationDetails ? this.state.notificationDetails.length : ''
    return (
      <>
        <StatusBar
          backgroundColor={Colors.mainBackground}
          barStyle="light-content"
        />
        <SafeAreaView backgroundColor={Colors.mainBackground} style={AppStyle.barStyle}>
          <View style={AppStyle.secondaryHeaderStyle}>
            <View style={AppStyle.headerContainer}>
              <TouchableOpacity
                style={AppStyle.headerLeft}
                onPress={() => this.navigateToChild()}>
                <AntDesign
                  style={{ height: 30, alignSelf: 'center' }}
                  name="arrowleft"
                  color={Colors.lightWhiteColor}
                  size={30}
                />
              </TouchableOpacity>
              <Text numberOfLines={1} style={AppStyle.secondaryHeaderTitle}>{'Notifications' + '(' + notificationLength + ')'}</Text>
              <TouchableOpacity style={{ width: 40 }}></TouchableOpacity>
            </View>
          </View>
          <Dialog.Container style={[ProductStyle.accordianView]} contentStyle={{ width: width - 40 }} visible={this.state.dialogShowChat}>
            <Dialog.Title style={[ProductStyle.titleContent]}>
              <View style={{ width: width - 80 }}>
                <TouchableOpacity
                  onPress={() => this.closeModal()}>
                  <AntDesign
                    name="closecircle"
                    style={ProductStyle.closeIcon}
                    size={24}
                    color={Colors.textColor}
                  />
                </TouchableOpacity>
              </View>
            </Dialog.Title>
            <Dialog.Description>
              <View style={{ width: width - 100 }} >
                <Text style={{ alignSelf: 'center', fontSize: 16, fontWeight: 'bold', padding: 5 }}>Reply to Buyer</Text>
                <Text style={{ alignSelf: 'center', fontSize: 14, textAlign: 'center', lineHeight: 25 }}>Setup anonymous nick name and start chat with buyer </Text>
                <Text>Nickname *</Text>
                <TextInput
                  autoCapitalize="none"
                  keyboardType={"visible-password"}
                  onChangeText={this.handleChangename}
                  value={this.state.nickName}
                  style={{
                    borderColor: Colors.placeholderColor, borderWidth: 1, justifyContent: 'center', marginTop: 10, height: 40, fontFamily: 'Poppins-Medium'
                  }}
                />
                {this.state.errorNameMsg == true ? (
                  <Text style={ProductStyle.errorMessage}>
                    * Please enter the Nick Name.
                  </Text>
                ) : null}
                <TouchableOpacity onPress={() => { this.onChatNavigate() }} style={AppStyle.applyButton}>
                  <Text style={AppStyle.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </Dialog.Description>
          </Dialog.Container>
          <Dialog.Container style={[ProductStyle.accordianView]} contentStyle={{ width: width - 40 }} visible={this.state.dialogShow}>

            <Dialog.Description>
              <View style={[ProductStyle.titleContent, { justifyContent: 'space-around', marginTop: 10 }]}>
                <View>
                  <Text style={{ alignSelf: 'flex-start', fontSize: 18, textAlign: 'left', fontWeight: 'bold', padding: 5 }}>{this.state.popUpContentTitle ? this.state.popUpContentTitle : ''}</Text>
                  <Text style={{ alignSelf: 'flex-start', fontSize: 16, textAlign: 'left', lineHeight: 25 }}>{this.state.popUpContentMsg ? this.state.popUpContentMsg : ''} </Text>
                </View>
                <View style={{ width: 50 }}></View>
                <TouchableOpacity
                  onPress={() => this.closeModal()}>
                  <AntDesign
                    name="closecircle"
                    style={ProductStyle.closeIcon}
                    size={24}
                    color={Colors.textColor}
                  />
                </TouchableOpacity>
              </View>
            </Dialog.Description>
          </Dialog.Container>
          <ScrollView
            style={{
              backgroundColor: Colors.lightWhiteColor,
              height: height - 150,
            }}
            contentInsetAdjustmentBehavior="automatic">
            {this.activateLoading()}
            {this.state.notificationDetails && this.state.notificationDetails.length > 0 && (
              <FlatList
                style={{ top: 30 }}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) => this._renderSectorItem(item, index)}
                data={this.state.notificationDetails}
              />
            )}
            <View style={{ flex: 1, marginTop: height / 4 }}>
                  <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: Colors.redColor, fontFamily: 'Poppins-Medium' }}>{this.state.notificationMessage}</Text>
                </View>
            <View style={{ paddingBottom: 20 }}></View>
          </ScrollView>
        </SafeAreaView>

      </>
    );
  }
}

export default Notification;
