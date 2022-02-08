import React, { Component, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Image, Dimensions, Alert,
  TextInput, Modal, ActivityIndicator, FlatList, BackHandler, Button,Linking
} from 'react-native';
import { AppStyle } from '../assets/styles/AppStyle';
import { ProductStyle } from '../assets/styles/ProductStyle';
import { Colors } from '../assets/styles/Colors';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductDetailsUrl, ChatNewUrl, FirstChatUrl, AllUsersUrl, ChatDetailsUrl, } from '../HelperApi/Api/APIConfig';
import { HttpHelper } from '../HelperApi/Api/HTTPHelper';
import { withNavigation } from 'react-navigation';
import SecondaryHeader from '../components/SecondaryHeader';
// import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
const { width, height } = Dimensions.get('screen');
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import Dialog from "react-native-dialog";


const Banner = props => {
  const [loading, setLoading] = useState(true);
  return (
    <View key={props.item.imageid} style={{ backgroundColor: Colors.lightWhiteColor, alignSelf: 'flex-start', height: height / 3 }}>
      {props.uri ?
        <FastImage
          style={{
            height: 350,
            width: width
          }}
          source={{
            uri: props.uri,
            headers: { Authorization: 'token' },
            priority: FastImage.priority.high
          }}
          onLoadStart={() => { setLoading(true) }}
          onLoadEnd={() => { setLoading(false) }}
          resizeMode={FastImage.resizeMode.cover}
        >
          <ActivityIndicator size="large" style={{ marginTop: 50 }} color={Colors.mainBackground} animating={loading} />
        </FastImage> :
        <FastImage
          style={{
            height: height / 2.5,
            width: width
          }}
          source={{
            uri: 'https://icon-library.net/images/no-picture-available-icon/no-picture-available-icon-1.jpg',
            headers: { Authorization: 'token' },
            priority: FastImage.priority.high
          }}
          onLoadStart={() => { setLoading(true) }}
          onLoadEnd={() => { setLoading(false) }}
          resizeMode={FastImage.resizeMode.cover}
        >
          <ActivityIndicator size="large" style={{ marginTop: 50 }} color={Colors.mainBackground} animating={loading} />
        </FastImage>
      }
    </View>
  )
}
class ProductDetails extends Component {
  constructor(props) {
    super(props);
    var params = this.props.route.params;
    this.state = {
      bannerImage: [],
      accessKeyDetails: {},
      productData: params && params.isSearch ? params && params.getProductDetails ? params.getProductDetails[0] : params.getProductDetails : [],
      productId: params && params.isSearch ? (params && params.getProductDetails) && params.getProductDetails[0].id : params.isChat ? params.getProductDetails : params.getProductDetails.id,
      accessKeyDetails: {},
      isLoading: false,
      chatFlag: false,
      dialogShow: false,
      nickName: '',
      offerMsg: '',
      errorNameMsg: false,
      errorOfferMsg: false,
      userDetails: [],
      chatFirst: '',
      errorOfferMsgLength: false,
      productDetails: params && params.getProductDetails ? params.getProductDetails : [],
      swiperImage: [],
      isNotifi: params && params.isNotifi ? params.isNotifi : false,
      isMyProduct: params && params.isMyProduct ? params.isMyProduct : false,
      currIndex: '',
      swiper: this.renderSwpier,
      isSwiperEnable: true,
      isUpdate: params && params.isUpdate ? params.isUpdate : false,
      selection: { start: 0, end: 0 },
      webLink:'',
      webFlag :'',
    }
    this.getDetails = this.getDetails.bind(this);
  }

  getDetails = () => {
    AsyncStorage.getItem('user', (err, userDetails) => {
      if (userDetails != null) {
        this.setState({ userDetails: JSON.parse(userDetails) }, () => {
        });
      }
    });
    AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
      if (accessKeyDetails != null) {
        this.setState({
          accessKeyDetails: JSON.parse(accessKeyDetails),
          isLoading: true,
        }, () => {
         
          let productDetails = HttpHelper(
            ProductDetailsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key +
            '&' +
            'prodid' +
            '=' +
            this.state.productId,
            'GET',
          );
          productDetails.then((response) => {
            if (response && response.status === 'true') {
              console.log(ProductDetailsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key +
              '&' +
              'prodid' +
              '=' +
              this.state.productId);
              console.log(response,'ProductDetailsUrl');
              this.setState({
                bannerImage: response.Products, isLoading: false,
                categoryProperty: response.category[0].catpropval,
                subCategoryProperty: response.subcategory[0].catpropval,
                chatFlag: response.user[0].Chatflag,
                userProductId: response.user[0].userid,
                chatFirst: response.user[0].Chatfirst,
                productBadge: response.Products ? response.Products[0].badge === "Y" ? true : false : false,
                swiperImage: response.Products[0].image,
                webLink:response.user[0].weblink,
                webFlag :response.user[0].webflag,
              })
            } else {
              this.setState({ bannerImage: [], isLoading: false })
            }
          });
        });
      }
    });
  }
  componentDidMount() {
    this.getDetails()
    // this.timers = setInterval(() => this.getDetails(), 5000)
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      const params = nextProps.route.params;
      this.setState({
        isNotifi: params && params.isNotifi ? params.isNotifi : false,
        isMyProduct: params && params.isMyProduct ? params.isMyProduct : false,
        productId: (params && params.getProductDetails) ? params.getProductDetails.id : '',
        isUpdate: params && params.isUpdate ? params.isUpdate : false,
      })
      const propProductId = (nextProps.route.params && nextProps.route.params.getProductDetails) ? nextProps.route.params.getProductDetails.id : '';
      AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
        if (accessKeyDetails != null) {
          this.setState({
            accessKeyDetails: JSON.parse(accessKeyDetails),
            isLoading: true,
          }, () => {
            let productDetails = HttpHelper(
              ProductDetailsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key +
              '&' +
              'prodid' +
              '=' +
              propProductId,
              'GET',
            );
            productDetails.then((response) => {
              this.setState({ isLoading: true })
              if (response.status === 'true') {
                console.log(response,'response');
                this.setState({
                  bannerImage: response.Products, isLoading: false,
                  categoryProperty: response.category[0].catpropval, subCategoryProperty: response.subcategory[0].catpropval,
                  chatFlag: response.user[0].Chatflag,
                  userProductId: response.user[0].userid,
                  chatFirst: response.user[0].Chatfirst,
                  productId: propProductId,
                  productBadge: response.Products ? response.Products[0].badge === "Y" ? true : false : false,
                  swiperImage: response.Products[0].image,
                  webLink:response.user[0].weblink,
                  webFlag :response.user[0].webflag,
                })
              } else {
                this.setState({ bannerImage: [], isLoading: false })
              }
            });
          });
        }
      });
    }
  }
  handleBackPress = () => {
    if (this.state.isMyProduct) {
      this.props.navigation.push('MyProduct', { isUpdate: this.state.isUpdate })
    } else {
      this.props.navigation.navigate('Home',{isProductDetails:true});
    }
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.popupDialog = null
  }
  _renderSectorItem = (item, index) => {
    return (
      <View key={index}
        style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20 }}>
        <View style={{ width: '45%' }}>
          <Text numberOfLines={3} style={[ProductStyle.specificDataText, { paddingTop: 10, }]}>
            {item.propname}
          </Text>
        </View>
        <View style={{ width: '5%' }}>
          <Text numberOfLines={2} style={[ProductStyle.specificDataText, { paddingTop: 10, }]}>
            :
            </Text>
        </View>
        <View style={{ width: '50%' }}>
          <Text numberOfLines={3} style={[ProductStyle.specificDataText, { paddingTop: 10, textAlign: 'left', alignSelf: 'flex-start', width: 150 }]}>
            {item.propval}
          </Text>
        </View>
        {/* <Text style={[ProductStyle.specificDataText, { paddingTop: 10 }]}></Text> */}
      </View>
    )
  }
  _renderSubSectorItem = (item, index) => {
    return (
      <View key={index} style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20 }}>
        <View style={{ width: '45%' }}>
          <Text numberOfLines={2} style={[ProductStyle.specificDataText, { paddingTop: 10, }]}>
            {item.propname}
          </Text>
        </View>
        <View style={{ width: '5%' }}>
          <Text numberOfLines={2} style={[ProductStyle.specificDataText, { paddingTop: 10, }]}>
            :
            </Text>
        </View>
        <View style={{ width: '50%' }}>
          <Text numberOfLines={2} style={[ProductStyle.specificDataText, { paddingTop: 10, }]}>
            {item.propval}
          </Text>
        </View>
      </View>
    )
  }
  closeModal() {
    this.setState({ dialogShow: false, errorNameMsg: false, errorOfferMsg: false, nickName: '', offerMsg: '' });
  }
  openModal() {
    console.log(this.state.webFlag,'this.state.webFlag');
    if(this.state.webFlag==="True"){
      Linking.openURL(this.state.webLink)
      this.props.navigation.navigate('Home')
      }
      else{
    if (this.state.userDetails.user.userid != this.state.userProductId && this.state.chatFirst === "True"  ) {
      this.setState({ dialogShow: true, isEnable: true },);
    } else{
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
          this.props.navigation.push("ChatScreen",
            { offerMsg: response && response.offermsg ? response.offermsg[0].offermsg : '', image: response && response.offermsg ? response.offermsg[0] : [], isProductConversation: true, productId: this.state.productId, getProductDetails: this.state.productDetails,isProductDetails: true })
        }
      })
    }
  }
  }
  
  onChatNavigate = () => {
    const { nickName, offerMsg, accessKeyDetails, productId } = this.state;
    if (nickName == "") {
      this.setState({ errorNameMsg: true })
    } else if (offerMsg == "") {
      this.setState({ errorOfferMsg: true })
    }
    else {     
        let firstChat = HttpHelper(
          FirstChatUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key +
          '&' +
          'prodid' +
          '=' +
          productId +
          '&' +
          'nickname' +
          '=' +
          nickName +
          '&' +
          'offer' +
          '=' +
          offerMsg,
          'POST',
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
                    this.props.navigation.push("ChatScreen", { offerMsg: offerMsg, nickName: nickName, image: this.state.bannerImage[0] ? this.state.bannerImage[0].image : null, isProductConversation: true, productId: productId ? productId : '', isProductDetails: true, getProductDetails: this.state.productDetails ? this.state.productDetails : [] })
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
  handleChangename = (value) => {
    if (value) {
      this.setState({ nickName: '', nickName: value, errorNameMsg: false });
    } else {
      this.setState({ nickName: '', errorNameMsg: false })
    }
  };
  handleChangeOffer = (offerMsg) => {
    if (offerMsg) {
      this.setState({ offerMsg: offerMsg, errorOfferMsg: false, });
    } else {
      this.setState({ errorOfferMsg: false, offerMsg: '' })
    }
  };
  _onNavigate = () => {
    if (this.state.isNotifi) {
      this.props.navigation.push('Notification');
    } else if (this.state.isMyProduct) {
      this.props.navigation.push('MyProduct', { isUpdate: this.state.isUpdate });
    } else {
      this.props.navigation.push('Home',{isProductDetails:true});
    }
  }
  render() {
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
            barStyle="dark-content"
          />
          <SafeAreaView style={[AppStyle.barStyle, { flex: 1 }]}>
            <View style={AppStyle.secondaryHeaderStyle}>
              <View style={AppStyle.headerContainer}>
                <TouchableOpacity
                  style={AppStyle.headerLeft}
                  onPress={() => this._onNavigate()}>
                  <AntDesign
                    style={{ height: 30, alignSelf: 'center' }}
                    name="arrowleft"
                    color={Colors.lightWhiteColor}
                    size={30}
                  />
                </TouchableOpacity>
                <Text numberOfLines={1} style={AppStyle.secondaryHeaderTitle}>{this.state.bannerImage[0] ? this.state.bannerImage[0].title : ''}</Text>
                <TouchableOpacity style={{ width: 40 }}></TouchableOpacity>
              </View>
            </View>
            <Dialog.Container style={[ProductStyle.accordianView]} contentStyle={{ width: width - 40 }} visible={this.state.dialogShow}>
              <Dialog.Title>
              <View style={{width:width-80}} >
                <TouchableOpacity style={[ProductStyle.titleContent]}
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
              <Dialog.Description >
                <View style={{ width: width - 100 }} >
                  <Text style={ProductStyle.offerTitle}> Make an Offer</Text>
                  <Text style={ProductStyle.nickNameText}>Setup anonymous nick name and make a short  offer to the seller</Text>
                  <Text>Nickname *</Text>
                  <TextInput
                    autoCapitalize="none"
                    keyboardType={"visible-password"}
                    onChangeText={(event) => this.handleChangename(event)}
                    // onChangeText={this.handleChangename}
                    onSelectionChange={({ nativeEvent: { selection } }) => {
                      this.setState({ selection }, () => {
                        console.log(this.state.selection, 'delo');
                      })
                    }}
                    value={this.state.nickName}
                    style={ProductStyle.nickNameinput}
                  />
                  {this.state.errorNameMsg == true ? (
                    <Text style={ProductStyle.errorMessage}>
                      * Please enter the Nick Name.
                    </Text>
                  ) : null}
                  <Text style={{ marginTop: 20 }}>Offer *(40 characters allowed)</Text>
                  <TextInput
                    autoCapitalize="none"
                    keyboardType={"visible-password"}
                    onChangeText={this.handleChangeOffer}
                    value={this.state.offerMsg}
                    // editable={(this.state.offerMsg && this.state.offerMsg.length>41)?false:true}  
                    maxLength={40}
                    style={ProductStyle.nickNameinput}
                  />
                  {this.state.errorOfferMsg == true ? (
                    <Text style={ProductStyle.errorMessage}>
                      * Please enter the Offer.
                    </Text>
                  ) : null}
                  {/* {this.state.errorOfferMsgLength == true ? (
                      <Text style={ProductStyle.errorMessage}>
                        * Offer msg should 40 characters allowed only.
                      </Text>
                    ) : null} */}
                  <TouchableOpacity
                    onPress={() => {
                      this.onChatNavigate()
                    }}
                    style={AppStyle.applyButton}>
                    <Text style={AppStyle.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </Dialog.Description>

            </Dialog.Container>
            <View style={{ height: 350 }}>
              {
                this.state.swiperImage && (
                  <Swiper
                    horizontal={true}
                    autoplay={this.state.isSwiperEnable}
                    autoplayTimeout={3}
                    pagingEnabled={true}
                    loop={true}
                    autoplayDisableOnInteraction={true}
                    ref='swiper'
                    dot={<View style={ProductStyle.dotView} />}
                    activeDot={<View style={ProductStyle.activeDotView} />}>
                    {this.state.swiperImage.map((item, i) => (
                      <TouchableOpacity key={item.imageid} onPress={() => { this.setState({ isSwiperEnable: false }) }}>
                        <Banner
                          uri={item.image}
                          key={item.imageid}
                          navigation={this.props.navigation}
                          item={item}
                        />
                      </TouchableOpacity>
                    )
                    )}
                  </Swiper>
                )}
            </View>
            <ScrollView
              style={{ backgroundColor: Colors.lightWhiteColor }}
              contentInsetAdjustmentBehavior="automatic">
              <View style={{ paddingHorizontal: 30, paddingVertical: 10 }}>
                <View style={ProductStyle.descriptionView}>
                  <Text numberOfLines={2} style={[ProductStyle.productTitleText, {}]}>
                    {this.state.bannerImage[0] ? this.state.bannerImage[0].title : ''}
                  </Text>
                  {this.state.productBadge && (
                    <Image
                      style={{ height: 50, width: '50%' }}
                      resizeMode="contain"
                      source={require('../assets/images/icons/offer.png')}
                    />
                  )}
                </View>
                <Text style={ProductStyle.productCodeText}>
                  {'PLN'} {this.state.bannerImage[0] ? this.state.bannerImage[0].price : ''}
                </Text>
                {(this.state.userDetails && this.state.userDetails.user && this.state.userDetails.user.userid != this.state.userProductId) && (
                  <TouchableOpacity
                    onPress={() => this.openModal()}
                    style={ProductStyle.offerButton}>
                    <Text numberOfLines={1} style={ProductStyle.offerText}>{(this.state.userDetails && this.state.userDetails.user && this.state.userDetails.user.userid != this.state.userProductId && this.state.chatFirst === "True") ? 'Make an Offer' : (this.state.userDetails && this.state.userDetails.user && this.state.userDetails.user.userid != this.state.userProductId) ? 'Product Conversation' : ''}</Text>
                  </TouchableOpacity>)}
                {this.state.categoryProperty && this.state.subCategoryProperty &&
                  <Text style={AppStyle.titleContent}>Properties</Text>}
                <View style={{ flexDirection: 'column' }}>
                  {this.state.categoryProperty &&
                    this.state.categoryProperty.length > 0 && (
                      <>
                        <Text style={[AppStyle.titleContent, { color: Colors.buttonColor, textAlign: 'center' }]}>Category</Text>
                        <FlatList
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item, index }) =>
                            this._renderSectorItem(item, index)
                          }
                          data={this.state.categoryProperty}
                        />
                      </>
                    )}
                </View>
                <View style={{
                  borderBottomColor: Colors.lightGreyColor,
                  borderWidth: 0.5,
                  margin: 10

                }}></View>
                <View style={{ flexDirection: 'column' }}>
                  {
                    this.state.subCategoryProperty &&
                    this.state.subCategoryProperty.length > 0 && (
                      <>
                        <Text style={[AppStyle.titleContent, { color: Colors.buttonColor, textAlign: 'center' }]}>SubCategory</Text>
                        <FlatList
                          style={{ flex: 1 }}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item, index }) =>
                            this._renderSubSectorItem(item, index)
                          }
                          data={this.state.subCategoryProperty}
                        />
                      </>
                    )}
                </View>
                <View>
                  <Text style={[AppStyle.titleContent, { marginTop: 20 }]}>
                    Product Description
                </Text>
                  <Text style={ProductStyle.descriptionText}>
                    {this.state.bannerImage[0] ? this.state.bannerImage[0].description : ''}
                  </Text>
                  <View style={{ height: 50 }}>
                  </View>
                  <Text style={[ProductStyle.descriptionText]}></Text>
                </View>
              </View>
            </ScrollView>
            {/* </SafeAreaView> */}
          </SafeAreaView>
        </>
      );
    }
  }
}

export default ProductDetails;
