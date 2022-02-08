import React, { Component } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ActivityIndicator, Image, Dimensions, FlatList, Animated, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Keyboard, BackHandler, Alert
} from 'react-native';
import { AppStyle } from '../assets/styles/AppStyle';
import { Colors } from '../assets/styles/Colors';
import SecondaryHeader from '../components/SecondaryHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ChatUrl, ChatNewUrl, ChatDetailsUrl, FirstSellerChatUrl, ChatDetailSellerUrl, ChatDetailAdminUrl, AdminChatUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper } from '../HelperApi/Api/HTTPHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConversationStyle } from '../assets/styles/ConversationStyle';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { GiftedChat } from 'react-native-gifted-chat';
import moment from 'moment';


const { width, height } = Dimensions.get('screen');

// var moment = require('moment')


class ChatScreen extends Component {
  constructor(props) {
    super(props);
    var params = this.props.route.params;
    this.state = {
      messages: [],
      chatMessage: '',
      image: params && params.getChatDetails ? params.getChatDetails.image : '',
      productName: params && params.getChatDetails ? params.getChatDetails.prodtitle : '',
      offerMsg: params && params.getChatDetails ? params.getChatDetails.chatmsg : '',
      value: '',
      userDetails: [],
      nickName: '',
      isSeller: params && params.isSeller ? params.isSeller : false,
      productId: params && params.productId ? params.productId : params && params.getChatDetails ? params.getChatDetails.prodid : '',
      chatImage: params && params.isProductConversation ? params.image && params.image.prodimg : params && params.getChatDetails ? params.getChatDetails.image : '',
      chatId: params && params.image ? params.image.chatid : params && params.getChatDetails ? params.getChatDetails.chatid : '',
      isProductDetails: params && params.isProductConversation ? params.isProductConversation : false,
      productDetails: params && params.getProductDetails ? params.getProductDetails : [],
      isLoading: true,
      isAdmin: params && params.isAdmin ? params.isAdmin : false,
      isKeyboard: false,
      isNotifi: params && params.isNotifi ? params.isNotifi : false,
      count: 0,
      isAutoFocus: false,
      isScrolling: true,
    }
    this.getDetails = this.getDetails.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }
  scrollToBottom() {
    if ((this.state.messages && this.state.messages.length > 0 && this.scroll && this.scroll.scrollToEnd != null)) {
      this.scroll.scrollToEnd()
    }
  }
  getDetails = () => {
    if ((this.state.messages && this.state.messages.length > 0 && this.scroll && this.scroll.scrollToEnd != null)) {
      this.scroll.scrollToEnd();
    }
    AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
      if (accessKeyDetails != null) {
        this.setState({
          accessKeyDetails: JSON.parse(accessKeyDetails),
          // isLoading: true,

        }, () => {
          if (this.state.isAdmin) {
            let chatDetailAdmin = HttpHelper(
              ChatDetailAdminUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key +
              '&' +
              'adchatid' +
              '=' +
              this.state.chatId,
              'POST',
            );
            chatDetailAdmin.then(response => {
              if (response && response.status === "true") {
                this.setState({
                  messages: response.chatlist,
                  offerMsg: response.offermsg ? response.offermsg[0].offermsg : '',
                  productName: response.prodinfo ? response.prodinfo[0].prodname : '',
                  image: response.prodinfo ? response.prodinfo[0].prodimg : '',
                  isLoading: false,
                  chatBox: response.chatbox ? response.chatbox : '',
                  chatBoxMsg: response.chatboxmsg ? response.chatboxmsg : '',
                }, () => { })
              } else {
                this.setState({
                  messages: [],
                  isLoading: false
                })
              }
            })
          }
          else if (this.state.isSeller) {
            let chatDetailSeller = HttpHelper(
              ChatDetailSellerUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key +
              '&' +
              'chatid' +
              '=' +
              this.state.chatId,
              'POST',
            );
            chatDetailSeller.then(response => {
              if (response && response.status === "true") {
                this.setState({
                  messages: response.chatlist,
                  offerMsg: response.offermsg ? response.offermsg[0].offermsg : '',
                  productName: response.offermsg ? response.offermsg[0].prodname : '',
                  image: response.offermsg ? response.offermsg[0].prodimg : '',
                  isLoading: false,
                  chatBox: response.chatbox ? response.chatbox : '',
                  chatBoxMsg: response.chatboxmsg ? response.chatboxmsg : '',

                }, () => {

                })
              } else {
                this.setState({
                  messages: [],
                  isLoading: false
                })
              }
            })
          } else {
            let chatDetails = HttpHelper(
              ChatDetailsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key +
              '&' +
              'prodid' +
              '=' +
              this.state.productId,
              'POST',
            );
            chatDetails.then(response => {
              if (response && response.status === "true") {
                this.setState({
                  messages: response.chatlist,
                  offerMsg: response.offermsg ? response.offermsg[0].offermsg : '',
                  productName: response.offermsg ? response.offermsg[0].prodname : '',
                  image: response.offermsg ? response.offermsg[0].prodimg : '',
                  isLoading: false,
                  chatBox: response.chatbox ? response.chatbox : '',
                  chatBoxMsg: response.chatboxmsg ? response.chatboxmsg : '',
                }, () => {

                })
              } else {
                this.setState({
                  messages: [],
                  isLoading: false
                })
              }
            })
          }
        });
      }
    });
    AsyncStorage.getItem('user', (err, userDetails) => {
      if (userDetails != null) {
        this.setState({ userDetails: JSON.parse(userDetails) }, () => {
        });
      }
    });
  }
  componentDidMount() {
    this.setState({ isKeyboard: true, isAutoFocus: true, }, () => {
      // this.getDetails()
      this.interval = setInterval(() => this.getDetails(), 1000);
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
      if ((this.state.messages && this.state.messages.length > 0 && this.FlatListRef && this.FlatListRef.scrollToEnd != null)) {
        this.FlatListRef.scrollToEnd();
      }
    })
  }
  handleBackPress = () => {
    if (this.state.isProductDetails) {
      this.props.navigation.push('ProductDetails', { getProductDetails: this.state.productId, isChat: true })
    } else if (this.state.isNotifi) {
      this.props.navigation.push('Notification')
    }
    else {
      this.props.navigation.push('Conversation', { getProductDetails: this.state.productDetails, isSeller: this.state.isSeller, isAdmin: this.state.isAdmin })
    }
    return true;
  };

  componentWillReceiveProps(nextProps) {
    const params = nextProps && nextProps.route.params;
    const productId = params ? params.productId : params.getChatDetails ? params.getChatDetails.prodid : '';
    const isSeller = params && params.isSeller ? params.isSeller : false;
    const isAdmin = params && params.isAdmin ? params.isAdmin : false;
    const chatId = params && params.image ? params.image.chatid : '';
    if (nextProps) {
      this.setState({
        isProductDetails: params && params.isProductConversation ? params.isProductConversation : false,
        isSeller: params && params.isSeller ? params.isSeller : false,
        isAdmin: params && params.isAdmin ? params.isAdmin : false,
        value: '',
        messages: [],
        chatMessage: '',
        image: params && params.getChatDetails ? params.getChatDetails.image : '',
        productName: params && params.getChatDetails ? params.getChatDetails.prodtitle : '',
        offerMsg: params && params.getChatDetails ? params.getChatDetails.chatmsg : '',
        userDetails: [],
        nickName: '',
        productId: params && params.productId ? params.productId : params && params.getChatDetails ? params.getChatDetails.prodid : '',
        chatImage: params && params.isProductConversation ? params.image && params.image.prodimg : params && params.getChatDetails ? params.getChatDetails.image : '',
        chatId: params && params.image ? params.image.chatid : params && params.getChatDetails ? params.getChatDetails.chatid : '',
        productDetails: params && params.getProductDetails ? params.getProductDetails : [],
        isLoading: true,
        isKeyboard: false,
        isNotifi: params && params.isNotifi ? params.isNotifi : false,
        count: 0,
      }, () => {
      })
      this.interval = setInterval(() =>
        AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
          if (accessKeyDetails != null) {
            this.setState({
              accessKeyDetails: JSON.parse(accessKeyDetails),
              // isLoading: true,
            }, () => {
              if (isAdmin) {
                let chatDetailAdmin = HttpHelper(
                  ChatDetailAdminUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key +
                  '&' +
                  'adchatid' +
                  '=' +
                  chatId,
                  'POST',
                );
                chatDetailAdmin.then(response => {
                  if (response && response.status === "true") {
                    this.setState({
                      messages: response.chatlist,
                      offerMsg: response.offermsg ? response.offermsg[0].offermsg : '',
                      productName: response.prodinfo ? response.prodinfo[0].prodname : '',
                      image: response.prodinfo ? response.prodinfo[0].prodimg : '',
                      isLoading: false,
                      chatBox: response.chatbox ? response.chatbox : '',
                      chatBoxMsg: response.chatboxmsg ? response.chatboxmsg : '',
                    }, () => {
                    })
                  } else {
                    this.setState({
                      messages: [],
                      isLoading: false
                    })
                  }
                })
              }
              else if (isSeller) {
                let chatDetailSeller = HttpHelper(
                  ChatDetailSellerUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key +
                  '&' +
                  'chatid' +
                  '=' +
                  chatId,
                  'POST',
                );
                chatDetailSeller.then(response => {
                  if (response && response.status === "true") {
                    this.setState({
                      messages: response.chatlist,
                      offerMsg: response.offermsg ? response.offermsg[0].offermsg : '',
                      productName: response.offermsg ? response.offermsg[0].prodname : '',
                      image: response.offermsg ? response.offermsg[0].prodimg : '',
                      isLoading: false,
                      chatBox: response.chatbox ? response.chatbox : '',
                      chatBoxMsg: response.chatboxmsg ? response.chatboxmsg : '',

                    }, () => {

                    })
                  } else {
                    this.setState({
                      messages: [],
                    })
                  }
                })
              } else {
                let chatDetails = HttpHelper(
                  ChatDetailsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key +
                  '&' +
                  'prodid' +
                  '=' +
                  productId,
                  'POST',
                );
                chatDetails.then(response => {
                  if (response && response.status === "true") {
                    this.setState({
                      messages: response.chatlist,
                      offerMsg: response.offermsg ? response.offermsg[0].offermsg : '',
                      productName: response.offermsg ? response.offermsg[0].prodname : '',
                      image: response.offermsg ? response.offermsg[0].prodimg : '',
                      isLoading: false,
                      productId: productId,
                      chatBox: response.chatbox ? response.chatbox : '',
                      chatBoxMsg: response.chatboxmsg ? response.chatboxmsg : '',

                    }, () => {

                    })
                  } else {
                    this.setState({
                      messages: []
                    })
                  }
                })
              }
            });

          }
        })
        , 1000);
    }
  }



  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    clearInterval(this.interval);
    clearInterval(this.Timeinterval);
    clearInterval(this.ScrollInterval);
    clearInterval(this.ScrollPropsInterval);
    this.interval = 0;
    this.Timeinterval = 0;
    // this.ScrollInterval = 0;
    this.ScrollPropsInterval = 0;
    this.FlatListRef.scrollToEnd = null
  }


  onSend = (value, isSeller, isAdmin) => {
    this.setState({
      count: this.state.count + 1,
      isScroll: true
    }, () => {

    })
    if (isAdmin) {
      if (this.state.accessKeyDetails && this.state.productDetails && value != '') {
        let adminChat = HttpHelper(
          AdminChatUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key +
          '&' +
          'adchatmsg' +
          '=' +
          value +
          '&' +
          'adchatid' +
          '=' +
          this.state.chatId,
          'POST',
        );
        adminChat.then(response => {
          if (response && response.status === "true") {
            this.setState({
              value: '',
              isAutoFocus: true,
              count: 0,

            }, () => {
              this.getDetails()
              if ((this.state.messages && this.state.messages.length > 0 && this.scroll && this.scroll.scrollToEnd == null)) {
                this.setState({
                  isLoading: true,
                  // isAutoFocus: true,
                })
              }
            })
          } else {
            this.setState({ value: '' })
          }
        })
      }
    }
    else if (isSeller) {
      if (this.state.accessKeyDetails && value != '') {
        let sellerChat = HttpHelper(
          FirstSellerChatUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key +
          '&' +
          'chatmsg' +
          '=' +
          value +
          '&' +
          'chatid' +
          '=' +
          this.state.chatId,
          'POST',
        );
        sellerChat.then(response => {
          if (response && response.status === "true") {
            this.setState({
              value: '',
              isAutoFocus: true,
              count: 0,
              // isLoading: true

            }, () => {
              this.getDetails()
              if ((this.state.messages && this.state.messages.length > 0 && this.scroll && this.scroll.scrollToEnd == null)) {
                this.setState({
                  isLoading: true,
                  // isAutoFocus: true,
                })
              }
            })
          } else {
            this.setState({ value: '', count: 0, }, () => {
              Alert.alert(
                '',
                response.message,
                [
                  {
                    text: 'OK', onPress: () => {
                      this.props.navigation.push('Conversation', { getProductDetails: this.state.productDetails, isSeller: this.state.isSeller, isAdmin: this.state.isAdmin })

                    }
                  },
                ],
                { cancelable: false }
              );
            })
          }
        })
      }
    } else {
      if (this.state.accessKeyDetails && this.state.productDetails && value != '') {
        let buyerChat = HttpHelper(
          ChatUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key +
          '&' +
          'prodid' +
          '=' +
          this.state.productId +
          '&' +
          'chatmsg' +
          '=' +
          value,
          'POST',
        );
        buyerChat.then(response => {
          if (response && response.status === 'true') {
            this.setState({
              value: '',
              isAutoFocus: true,
              count: 0,
              // isLoading: true
            }, () => {
              this.getDetails()
              if ((this.state.messages && this.state.messages.length > 0 && this.scroll && this.scroll.scrollToEnd == null)) {
                this.setState({
                  isLoading: true,
                  // isAutoFocus: true,
                })
              }
            })
          }
          else {
            this.setState({ value: '', count: 0, }, () => {
              Alert.alert(
                '',
                response.message,
                [
                  {
                    text: 'OK', onPress: () => {
                      this.props.navigation.push('Conversation', { getProductDetails: this.state.productDetails, isSeller: this.state.isSeller, isAdmin: this.state.isAdmin })
                    }
                  },
                ],
                { cancelable: false }
              );
            })
          }
        })
      }
    }
  }

  renderFlatListItem = item => {
    return (
      <>
        <View style={ConversationStyle.flatListContainerStyle}>
          {item.item.side === "right" ?
            <View style={[ConversationStyle.clientMsgStyle, { flexDirection: 'column' }]}>
              <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text numberOfLines={2} style={{ textAlign: 'left', color: Colors.lightWhiteColor, width: 100 }}>{item.item.name}</Text>
                <Text numberOfLines={2} style={{ textAlign: 'right', color: Colors.lightWhiteColor, width: 100 }}>{moment(item.item.chattime).format('D MMM YYYY HH:mm ')}</Text>
              </View>
              <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={{ textAlign: 'left', color: Colors.lightWhiteColor, paddingVertical: 5, width: width / 2 + 50 }}>{item.item.msg}</Text>
              </View>
            </View>
            : (<View style={[ConversationStyle.serverMsgStyle, { flexDirection: 'column' }]}>
              <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text numberOfLines={2} style={{ textAlign: 'left', width: 100 }}>{item.item.name}</Text>
                <Text numberOfLines={2} style={{ textAlign: 'right', width: 100 }}>{moment(item.item.chattime).format('D MMM YYYY HH:mm ')}</Text>
              </View>
              <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={{ textAlign: 'left', color: Colors.textColor, paddingVertical: 5, width: width / 2 + 50 }}>{item.item.msg}</Text>
              </View>
            </View>)}
          <View style={{ height: 10 }}></View>
        </View>
      </>
    )
  };
  navigateToChild = () => {
    if (this.state.isProductDetails) {
      this.props.navigation.push('ProductDetails', { getProductDetails: this.state.productId, isChat: true })
    } else if (this.state.isNotifi) {
      this.props.navigation.push('Notification')
    }
    else {
      this.props.navigation.goBack('Conversation', { getProductDetails: this.state.productDetails, isSeller: this.state.isSeller, isAdmin: this.state.isAdmin })
    }
  }

  render() {
    if ((this.state.messages && this.state.messages.length > 0 && this.scroll && this.scroll.scrollToEnd != null)) {
      this.scroll.scrollToEnd()
    }
    if (this.state.isLoading) {
      return (
        <Modal transparent={true} visible={this.state.isLoading}>
          <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={Colors.mainBackground} />
          </View>
        </Modal>
      )
    } else {
      return (
        <>
          <StatusBar
            backgroundColor={Colors.mainBackground}
            barStyle="light-content"
          />
          <SafeAreaView backgroundColor={Colors.mainBackground}></SafeAreaView>
          {/* <SecondaryHeader title={this.state.productName} navigation={this.props.navigation} chat={true} /> */}

          <View style={AppStyle.secondaryHeaderStyle}>
            <View style={AppStyle.headerContainer}>
              <TouchableOpacity
                style={AppStyle.headerLeft}
                onPress={() => {
                  this.navigateToChild()
                }}>
                <AntDesign
                  style={{ height: 30, alignSelf: 'center' }}
                  name="arrowleft"
                  color={Colors.lightWhiteColor}
                  size={30}
                />
              </TouchableOpacity>
              <Text numberOfLines={1} style={AppStyle.secondaryHeaderTitle}>{this.state.productName}</Text>
              <TouchableOpacity style={{ width: 40 }}></TouchableOpacity>
              {/* </View> */}
            </View>
          </View>
          <ScrollView style={{ marginBottom: 50 }} ref={c => {
            this.scroll = c;
          }} onTouchEnd={(c) => this.scroll = c} scrollEnabled={true} keyboardShouldPersistTaps="always">
            <View style={{ alignContent: 'center', alignSelf: 'center', justifyContent: 'center', height: 140, marginVertical: 10, borderRadius: 70, marginTop: 20 }}>
              <Image
                source={{ uri: this.state.image ? this.state.image : '' }}
                style={{
                  width: 120, height: 120, alignSelf: 'center', borderRadius: 200, borderColor: Colors.buttonColor, borderWidth: 3
                }} />
            </View>
            <View style={{ justifyContent: "center", alignSelf: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', color: Colors.textColor }}>
                {this.state.productName}</Text>
              {!this.state.isAdmin &&
                <Text numberOfLines={2} style={{ color: Colors.buttonColor, fontWeight: 'bold', fontSize: 16, textAlign: 'center', width: 250 }}>Offer Message : <Text style={{ color: Colors.textColor }}>{this.state.offerMsg}</Text></Text>}
            </View>

            <View style={{ flex: 1 }}>
              <KeyboardAvoidingView
                style={{ marginBottom: 250 }}
                keyboardVerticalOffset={height - 1500}>
                <FlatList
                  initialNumToRender={500}
                  data={this.state.messages}
                  onTouchStart={() => this.scroll.scrollToEnd = null}
                  onTouchEnd={(c) => this.scroll = c}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={this.renderFlatListItem}
                  // showsVerticalScrollIndicator={false}
                  ref={ref => (this.FlatListRef = ref)}
                  // onContentSizeChange={() => this.scroll.scrollToEnd = null}
                  keyboardShouldPersistTaps='always'
                />
              </KeyboardAvoidingView>
            </View>
          </ScrollView>
          <View style={(this.state.chatBox == "" && this.state.chatBoxMsg == "")?ConversationStyle.sendMessageConatinerStyle:ConversationStyle.sendMessageDisableConatinerStyle}>
            {(this.state.chatBox == "" && this.state.chatBoxMsg == "") ? (
              <>
                <TextInput
                  style={ConversationStyle.sendMsgTextInputStyle}
                  autoFocus={this.state.isAutoFocus}
                  value={this.state.value}
                  placeholder={"Enter your message"}
                  placeholderTextColor={Colors.placeholderColor}
                  onSubmitEditing={() => this.onSend(this.state.value, this.state.isSeller, this.state.isAdmin)}
                  returnKeyType="send"
                  multiline={true}
                  onChangeText={val => this.setState({ value: val })}></TextInput>
                {this.state.count === 0 && (
                  <TouchableOpacity disabled={this.state.value === "" ? true : false}
                    style={ConversationStyle.sendMsgButtonStyle}
                    onPress={() =>
                      this.onSend(this.state.value, this.state.isSeller, this.state.isAdmin)
                    } >
                    <MaterialIcons color={Colors.placeholderColor} style={ConversationStyle.sendIcon} name="send" size={25} />
                  </TouchableOpacity>
                )}
              </>

            ) : (
              <Text numberOfLines={3} style={ConversationStyle.sendMsgDisableButtonStyle}>{this.state.chatBoxMsg ? this.state.chatBoxMsg : 'Tamilll'}</Text>

            )}
          </View>
        </>
      );
    }
  }
}
export default ChatScreen;
