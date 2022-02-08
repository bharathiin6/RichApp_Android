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
  Dimensions, Alert, BackHandler, ActivityIndicator
} from 'react-native';
import { AppStyle } from '../assets/styles/AppStyle';
import { ConversationStyle } from '../assets/styles/ConversationStyle';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from '../assets/styles/Colors';
import * as Animatable from 'react-native-animatable';
import SecondaryHeader from '../components/SecondaryHeader';
const { width, height } = Dimensions.get('screen');
import { ChatListUrl, ChatDeleteUrl, FirstChatUrl, ChatUrl, FirstSellerChatUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper, HttpAuthHelper } from '../HelperApi/Api/HTTPHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropdownAlert from 'react-native-dropdownalert';
import Dialog from "react-native-dialog";
import { ProductStyle } from '../assets/styles/ProductStyle';
import Octicons from 'react-native-vector-icons/Octicons';
import FastImage from 'react-native-fast-image';
import moment from 'moment';



// var moment = require('moment')

class Conversation extends Component {
  constructor(props) {
    super(props);
    var params = this.props.route.params;
    this.state = {
      productDetails: [],
      isActive: params && params.isSeller ? false : params && params.isAdmin ? false : params && params.notificationType ? params.notificationType === "BUY" ? true : false : true,
      isDeactive: params && params.isSeller ? true : params && params.isAdmin ? false : params && params.notificationType ? params.notificationType === "SEL" ? true : false : false,
      accessKeyDetails: {},
      isAdmin: params && params.isAdmin ? true : params && params.notificationType ? params.notificationType === "Admin" ? true : false : false,
      isLoading: false,
      buyOffersData: [],
      sellerOffersData: [],
      adminData: [],
      waitingProducts: [],
      screenHeight: 0,
      dialogShow: false,
      errorNameMsg: false,
      isNotifi: params && params.isNotifi ? true : false,
      errorData: ''
    }
  }

  getDetails = () => {
    AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
      if (accessKeyDetails != null) {
        this.setState({
          accessKeyDetails: JSON.parse(accessKeyDetails),
          isLoading: true,
        }, () => {
          let chatList = HttpHelper(
            ChatListUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
          chatList.then((response) => {
            this.setState({ isLoading: true })
            if (response.status === 'true') {
              this.setState({
                buyOffersData: response.buyer,
                sellerOffersData: response.seller,
                adminData: response.admin,
                isLoading: false,
                errorBuyerData: response.buyer ? response.buyer.message : '',
                errorSellerData: response.seller ? response.seller.message : '',
                errorAdminData: response.admin ? response.admin.message : ''
              })
            } else {
              this.setState({
                activeProducts: [],
                waitingProducts: [],
                isLoading: false,
              })
            }
          });
        });
      }
    });
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    this.setState({ isLoading: true }, () => {
      this.getDetails();
    })
  }
  handleBackPress = () => {
    if (this.state.isNotifi) {
      this.props.navigation.push('Notification')
    } else {
      this.props.navigation.push('Home')
    }
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
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
            let chatList = HttpHelper(
              ChatListUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
            chatList.then((response) => {
              this.setState({ isLoading: true })
              if (response.status === 'true') {
                this.setState({
                  buyOffersData: response.buyer,
                  sellerOffersData: response.seller,
                  adminData: response.admin,
                  isLoading: false,
                })
              } else {
                this.setState({
                  activeProducts: [],
                  waitingProducts: [],
                  isLoading: false,
                })
              }
            });
          });
        }
      });
    }
  }
  _deletePopup = (item, type) => {
    Alert.alert(
      '',
      'Are you sure you want to delete?',
      [
        {
          text: 'OK',
          onPress: () => {
            this._deleteHandle(item, type);
          },
        },
        {
          text: 'Cancel',
          onPress: () => console.log('No Pressed'), style: 'cancel'
        },
      ],
      { cancelable: false },
    );

  }
  _deleteHandle = (item, type) => {
    if (this.state.accessKeyDetails && item != null) {
      if (type === "Buyer") {
        let deleteChatList = HttpAuthHelper(ChatDeleteUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key + '&' + 'buychatid' + '=' + item.chatid, 'GET', '',);
        deleteChatList.then((response) => {
          this.setState({ isLoading: true });
          if (response.status === 'true') {
            this.setState({ isLoading: false });
            Alert.alert(
              '',
              response.message,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    this.getDetails();
                  },
                },
              ],
              { cancelable: false },
            );
          } else {
            this.dropdown.alertWithType('error', 'Error!', response.message);
            this.setState({ isLoading: true });
          }
        });
      }

      if (type === "Seller") {
        let deleteChatList = HttpAuthHelper(ChatDeleteUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key + '&' + 'selchatid' + '=' + item.chatid, 'POST', '',);
        deleteChatList.then((response) => {
          this.setState({ isLoading: true });
          if (response.status === 'true') {
            this.setState({ isLoading: false });
            Alert.alert(
              '',
              response.message,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    this.getDetails();
                  },
                },
              ],
              { cancelable: false },
            );
          } else {
            this.dropdown.alertWithType('error', 'Error!', response.message);
            this.setState({ isLoading: true });
          }
        });
      }
      if (type === "Admin") {
        let deleteChatList = HttpAuthHelper(ChatDeleteUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key + '&' + 'adminchatid' + '=' + item.chatid, 'DELETE', '',);
        deleteChatList.then((response) => {
          this.setState({ isLoading: true });
          if (response.status === 'true') {
            this.setState({ isLoading: false });
            Alert.alert(
              '',
              response.message,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    this.getDetails();
                  },
                },

              ],
              { cancelable: false },
            );
          } else {
            this.dropdown.alertWithType('error', 'Error!', response.message);
            this.setState({ isLoading: true });
          }
        });
      }
    }
  }
  activePopup = (item, type) => {
    const deletedBuyerChat = item.reply
    if (item.firstmsg === "True") {
      this.setState({
        dialogShow: true,
        getItem: item
      })
    } else {
      this.setState({
        getItem: item
      }, () => {
        if (deletedBuyerChat === "D") {
          Alert.alert(
            '',
            'Your Offer deleted by seller, so you can not continue with this chat.Delete it and make an new offer',
            [
              {
                text: 'OK', onPress: () => {
                }
              },
            ],
            { cancelable: false }
          );
        } else {
          this.props.navigation.push("ChatScreen",
            { image: item, productId: item.prodid, isSeller: type === "Seller" ? true : false, isAdmin: type === "Admin" ? true : false })
        }
      })
    }
  }
  _renderSectorItem = (item, type) => {
    var isRead = item.read === "Y" ? true : false;
    return (
      <Animatable.View
        animation="zoomIn"
        duration={1200}
        style={ConversationStyle.animateView}>
        <TouchableOpacity onPress={() => this.activePopup(item, type)}>
          <View style={ConversationStyle.animationText}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

              {item.image ?
                <FastImage
                  style={ConversationStyle.conversationImage}
                  source={{
                    uri: item.image ? item.image : null,
                    headers: { Authorization: 'token' },
                    priority: FastImage.priority.high
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                  onLoadStart={() => { this.setState({ loading: true }) }}
                  onLoadEnd={() => { this.setState({ loading: false }) }}
                >
                  <ActivityIndicator size="small" color={Colors.mainBackground} style={{ marginTop: 50 }} animating={this.state.loading} />
                </FastImage> :
                <FastImage
                  style={ConversationStyle.conversationImage}
                  source={{
                    uri: 'https://icon-library.net/images/no-picture-available-icon/no-picture-available-icon-1.jpg',
                    headers: { Authorization: 'token' },
                    priority: FastImage.priority.high
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                  onLoadStart={() => { this.setState({ loading: true }) }}
                  onLoadEnd={() => { this.setState({ loading: false }) }}
                >

                  <ActivityIndicator size="small" color={Colors.mainBackground} style={{ marginTop: 50 }} animating={this.state.loading} />
                </FastImage>
              }
              <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 0.7 }}>
                    <Text numberOfLines={1} style={[ConversationStyle.contentAnimateView, {}]}>
                      {item.prodtitle}
                    </Text>
                  </View>
                  <View style={{ flex: 0.3, alignSelf: 'flex-end' }}>
                    <TouchableOpacity onPress={() => this._deletePopup(item, type)} style={ConversationStyle.buttonView}>
                      <Text style={{ textAlign: 'right', fontWeight: 'bold' }}> <AntDesign
                        name="delete"
                        style={[AppStyle.iconShadow]}
                        size={15}
                        color={Colors.textColor}
                      />
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text numberOfLines={1} style={[ConversationStyle.contentDescription, { maxWidth: 250 }]}>
                  {item.chatmsg}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', top: 10 }}>
                  <Text style={[{ alignSelf: 'flex-start', paddingLeft: 10 }]}>
                    {moment(item.chatdate).format('D MMM YYYY')}{'   '}{moment(item.chatdate).format('HH:mm ')}
                  </Text>
                  <Text style={[{ alignSelf: 'flex-start' }]}>

                  </Text>
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
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <Text style={ConversationStyle.underLine}></Text>
      </Animatable.View>
    );
    // }

  };
  _toNavigate = (type) => {
    if (type === 'BuyOffers') {
      this.setState({
        isActive: true, isDeactive: false, isAdmin: false
      })
    } else if (type === 'SellOffers') {
      this.setState({
        isActive: false, isDeactive: true, isAdmin: false
      })
    }
    else if (type === 'Admin') {
      this.setState({
        isActive: false, isDeactive: false, isAdmin: true
      })
    }
  };

  closeModal() {
    this.setState({ dialogShow: false, errorNameMsg: false, nickName: '', offerMsg: '' });
  }

  onChatNavigate = () => {
    const { nickName, productId, getItem } = this.state;
    if (nickName == undefined) {
      this.setState({ errorNameMsg: true })
    } else {

      let firstChat = HttpHelper(
        FirstChatUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key +
        '&' +
        'prodid' +
        '=' +
        getItem.prodid +
        '&' +
        'sellername' +
        '=' +
        nickName +
        '&' +
        'chatid' +
        '=' +
        getItem.chatid,
        'GET',
      );
      firstChat.then(response => {
        if (response && response.status === "true") {
          this.setState({
            dialogShow: false
          }, () => {
            Alert.alert(
              '',
              response.Message,
              [
                {
                  text: 'OK', onPress: () => {
                    this.props.navigation.push("ChatScreen", { nickName: nickName, image: this.state.getItem, isSeller: true, productId: productId })
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
  handleChangename = (nickName) => {
    if (nickName) {
      this.setState({ nickName: nickName, errorNameMsg: false });
    } else {
      this.setState({ nickName: '', errorNameMsg: false })
    }
  };
  navigateToChild = () => {
    if (this.state.isNotifi) {
      this.props.navigation.push('Notification')
    } else {
      this.props.navigation.push('Home')
    }
  }
  render() {
    const scrollEnabled = this.state.screenHeight > height;
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
              <Text numberOfLines={1} style={AppStyle.secondaryHeaderTitle}>{'Conversations'}</Text>
              <TouchableOpacity style={{ width: 40 }}></TouchableOpacity>
            </View>
          </View>
          <ScrollView style={{ height: height - 190 }}>
            <Dialog.Container style={[ProductStyle.accordianView]} contentStyle={{ width: width - 40 }} visible={this.state.dialogShow}>
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
            <View style={ConversationStyle.conversationMainView}>
              <TouchableOpacity
                style={
                  this.state.isActive
                    ? [
                      ConversationStyle.activeView,
                      { backgroundColor: Colors.redColor },

                    ]
                    : [
                      ConversationStyle.activeView,
                      { backgroundColor: Colors.deactiveColor },
                    ]
                }
                onPress={() => {
                  this._toNavigate('BuyOffers');
                }}>
                <Text style={ConversationStyle.offerText}>Buy Offers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 0.02 }}></TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this._toNavigate('SellOffers');
                }}
                style={
                  this.state.isDeactive
                    ? [
                      ConversationStyle.activeView,
                      { backgroundColor: Colors.redColor },
                    ]
                    : [
                      ConversationStyle.activeView,
                      { backgroundColor: Colors.deactiveColor },
                    ]
                }>
                <Text style={ConversationStyle.offerText}>Sell Offers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 0.02 }}></TouchableOpacity>
              {this.state.adminData.length > 0 &&
                <TouchableOpacity
                  style={
                    this.state.isAdmin
                      ? [
                        ConversationStyle.activeView,
                        { backgroundColor: Colors.redColor },
                      ]
                      : [
                        ConversationStyle.activeView,
                        { backgroundColor: Colors.deactiveColor },
                      ]}
                  onPress={() => {
                    this._toNavigate('Admin');
                  }}>
                  <Text style={ConversationStyle.offerText}>Admin</Text>
                </TouchableOpacity>
              }
            </View>
            {(this.state.isActive && this.state.buyOffersData && this.state.buyOffersData.length > 0) ? (
              <FlatList
                style={{ top: 30 }}
                keyExtractor={(item, index) => item.chatid}
                renderItem={({ item }) => this._renderSectorItem(item, 'Buyer')}
                data={this.state.buyOffersData}
              />
            ) :
              this.state.isActive &&
              (<Text style={{ justifyContent: 'center', marginTop: height / 4, fontSize: 18, flex: 1, alignSelf: 'center', color: Colors.redColor, fontWeight: 'bold' }}>{this.state.errorBuyerData}</Text>)
            }
            <View style={{ paddingBottom: 20 }}></View>
            {(this.state.isDeactive && this.state.sellerOffersData && this.state.sellerOffersData.length > 0) ? (
              <FlatList
                style={{ top: 30 }}
                keyExtractor={(item, index) => item.chatid}
                renderItem={({ item }) => this._renderSectorItem(item, 'Seller')}
                data={this.state.sellerOffersData}
              />
            ) :
              this.state.isDeactive &&
              (<Text style={{ justifyContent: 'center', marginTop: height / 4, fontSize: 18, flex: 1, alignSelf: 'center', color: Colors.redColor, fontWeight: 'bold' }}>{this.state.errorSellerData}</Text>)
            }
            {(this.state.isAdmin && this.state.adminData && this.state.adminData.length > 0) ? (
              <FlatList
                style={{ top: 30 }}
                keyExtractor={(item, index) => item.chatid}
                renderItem={({ item }) => this._renderSectorItem(item, 'Admin')}
                data={this.state.adminData}
              />
            ) : this.state.isAdmin &&
            (<Text style={{ justifyContent: 'center', marginTop: height / 4, fontSize: 18, flex: 1, alignSelf: 'center', color: Colors.redColor, fontWeight: 'bold' }}>{this.state.errorAdminData}</Text>)}
          </ScrollView>
        </SafeAreaView>
        <DropdownAlert
          ref={(ref) => (this.dropdown = ref)}
          containerStyle={{
            backgroundColor: '#FF0000',
          }}
          imageSrc={'https://facebook.github.io/react/img/logo_og.png'}
        />
      </>
    );
  }
}

export default Conversation;
