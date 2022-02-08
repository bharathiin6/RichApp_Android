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
  Dimensions, Modal, ActivityIndicator, Alert, BackHandler, Linking
} from 'react-native';
import { AppStyle } from '../assets/styles/AppStyle';
import { ConversationStyle } from '../assets/styles/ConversationStyle';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from '../assets/styles/Colors';
import * as Animatable from 'react-native-animatable';
import SecondaryHeader from '../components/SecondaryHeader';
const { width, height } = Dimensions.get('screen');
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyProductsUrl, DeleteProductUrl, MyAccountUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper, HttpAuthHelper } from '../HelperApi/Api/HTTPHelper';
import DropdownAlert from 'react-native-dropdownalert';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';



class MyProduct extends Component {
  constructor(props) {
    super(props);
    var params = this.props.route.params;
    this.state = {
      productDetails: [],
      isActive: params && params.isUpdate ? false : true,
      isDeactive: params && params.isUpdate ? true : false,
      accessKeyDetails: {},
      isLoading: false,
      activeProducts: [],
      waitingProducts: [],
      isSetting: params && params.isSetting ? params.isSetting : false
    }
  }

  getDetails = () => {
    AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
      if (accessKeyDetails != null) {
        AsyncStorage.getItem('user', (err, userDetails) => {
          if (userDetails != null) {
            const userInformation = JSON.parse(userDetails)
            this.setState({
              accessKeyDetails: JSON.parse(accessKeyDetails),
              isLoading: true,
              userDetails: userInformation,

            }, () => {
              let productDetails = HttpHelper(
                MyProductsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
              productDetails.then((response) => {
                console.log(response,'response');
                this.setState({ isLoading: true })
                if (response.status === 'true') {
                  this.setState({
                    activeProducts: response.Waiting ? response.Active :[],
                    waitingProducts: response.Waiting  ? response.Waiting :[],
                    isLoading: false
                  })
                } else {
                  this.setState({
                    activeProducts: [],
                    waitingProducts: [],
                    isLoading: false,
                  })
                }
              });
              this.timers = setInterval(() => this.getMyAccountData(), 1000)
            });
          }
        })
      }
    });
  }
  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      this.interval = setInterval(() => this.getDetails(), 1000);
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    })
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
    });
  }
  handleBackPress = () => {
    if (this.state.isSetting) {
      this.props.navigation.goBack()
    } else {
      this.props.navigation.push('Home')
    } return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    clearInterval(this.interval);
    this.interval = 0;
    clearInterval(this.intervals);
    this.intervals = 0;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      const params = nextProps.route.params
      AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
        if (accessKeyDetails != null) {
          AsyncStorage.getItem('user', (err, userDetails) => {
            if (userDetails != null) {
              const userInformation = JSON.parse(userDetails)
              this.setState({
                accessKeyDetails: JSON.parse(accessKeyDetails),
                isLoading: true,
                isActive: params && params.isUpdate ? false : true,
                isDeactive: params && params.isUpdate ? true : false,
                isSetting: params && params.isSetting ? params.isSetting : false,

              }, () => {
                let productDetails = HttpHelper(
                  MyProductsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
                productDetails.then((response) => {
                  this.setState({ isLoading: true })
                  if (response.status === 'true') {
                    this.setState({
                      activeProducts: response.Active,
                      waitingProducts: response.Waiting,
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
                this.getMyAccount()
              });
            }
          })
        }
      })
    }
  }
  getMyAccount = () => {
    let MyAccountDeatils = HttpHelper(
      MyAccountUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
    MyAccountDeatils.then((response) => {
      if (response.status === 'true') {
        this.setState({
          webFlag: response.user.webflag === "True" ? true : false,
          webLink: response.user.weblink
        })
      }
    });
  }
  _onEditNavigate = (item) => {
    if (this.state.webFlag) {
      Linking.openURL(this.state.webLink)
      this.props.navigation.navigate('Home')

      
    } else {
      this.props.navigation.push('AddProduct', { getProductDetails: item, isUpdate: true })
    }
  }

  _renderActiveSectorItem = (item) => {
    return (
      <Animatable.View
        animation="zoomIn"
        duration={1200}
        style={[ConversationStyle.animationText, ConversationStyle.underLine, { height: 100 }]}>
        <TouchableOpacity onPress={() => {
          this.props.navigation.push('ProductDetails', { getProductDetails: item, isMyProduct: true, isUpdate: true })
        }}>
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

            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Text numberOfLines={1} style={[ConversationStyle.contentAnimateView, { width: 100, maxWidth: 100 }]}>
                  {item.title}
                </Text>
                <TouchableOpacity style={{ height: 20, width: 10 }} />
                <TouchableOpacity onPress={() => {
                  this._onEditNavigate(item)
                }} style={ConversationStyle.buttonView}>
                  <Entypo
                    name="edit"
                    style={[AppStyle.iconShadow, { padding: 1.5 }]}
                    size={15}
                    color={Colors.textColor}
                  />
                  <Text>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ height: 20, width: 5 }} />
                <TouchableOpacity onPress={() => this._deleteHandle(item)} style={ConversationStyle.buttonView}>
                  <AntDesign
                    name="delete"
                    style={[AppStyle.iconShadow, { padding: 1.5 }]}
                    size={15}
                    color={Colors.textColor}
                  />
                  <Text style={{ fontFamily: 'Poppins-Medium' }}>Remove</Text>
                </TouchableOpacity>
              </View>
              <Text numberOfLines={2} style={[ConversationStyle.contentDescription, { maxWidth: 200 }]}>
                {item.description}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  _renderWaitingSectorItem = (item) => {
    return (
      <>
        <Animatable.View
          animation="zoomIn"
          duration={1200}
          style={ConversationStyle.animationText, ConversationStyle.underLine}>
          <View style={ConversationStyle.animationText}>
            <TouchableOpacity onPress={() => {
              this.props.navigation.push('ProductDetails', { getProductDetails: item, isMyProduct: true, isUpdate: false })
            }}>
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
                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                  <View
                    style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Text numberOfLines={1} style={[ConversationStyle.contentAnimateView, { width: 100, maxWidth: 80 }]}>
                      {item.title}
                    </Text>
                    <TouchableOpacity style={{ height: 20, width: 70 }} />
                    <TouchableOpacity onPress={() => this._deleteHandle(item)} style={[ConversationStyle.buttonView, { width: 100 }]}>
                      <AntDesign
                        name="delete"
                        style={[AppStyle.iconShadow, { padding: 1.5 }]}
                        size={15}
                        color={Colors.textColor}
                      />
                      <Text style={{ fontFamily: 'Poppins-Medium' }}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                  <Text numberOfLines={2} style={[ConversationStyle.contentDescription, { maxWidth: 200 }]}>
                    {item.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Animatable.View>
        <View style={{ height: 10 }}>

        </View>
      </>
    );
  };
  _toNavigate = (type) => {
    this.setState({ isLoading: true })
    if (type === 'Waiting Products') {
      this.setState({ isActive: true, isDeactive: false, isLoading: false });
    } else {
      this.setState({ isActive: false, isDeactive: true, isLoading: false });
    }
  };
  _deleteHandle(item) {
    if (this.state.webFlag) {
      Linking.openURL(this.state.webLink)
      this.props.navigation.navigate('Home')

    } else {
      if (this.state.accessKeyDetails && item != null) {
        let deleteProduct = HttpAuthHelper(DeleteProductUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key + '&' + 'prodid' + '=' + item.id, 'DELETE', '',);
        deleteProduct.then((response) => {
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

  activityLoading() {
    if (this.state.isLoading) {
      return (
        <Modal transparent={true} visible={this.state.isLoading}>
          <View style={{ backgroundColor: 'rgba(22,22,22,0.4)', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={Colors.mainBackground} />
          </View>
        </Modal>
      );
    }
  }
  _onNavigate = () => {
    if (this.state.isSetting) {
      this.props.navigation.goBack()
    } else {
      this.props.navigation.push('Home')
    }
  }
  _onChildNavigate = () => {
    if (this.state.webFlag) {
      Linking.openURL(this.state.webLink)
      this.props.navigation.navigate('Home')

    } else {
      this.props.navigation.push('AddProduct', { isAdd: true })

    }
  }
  render() {
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
                onPress={() => this._onNavigate()}>
                <AntDesign
                  style={{ height: 30, alignSelf: 'center' }}
                  name="arrowleft"
                  color={Colors.lightWhiteColor}
                  size={30}
                />
              </TouchableOpacity>
              <Text numberOfLines={1} style={AppStyle.secondaryHeaderTitle}>{"My Products"}</Text>
              <TouchableOpacity
                onPress={() => this._onChildNavigate()}
                style={AppStyle.secondaryHeaderAdd}>
                <Ionicons name="add-outline" size={40} color={Colors.buttonColor} />
              </TouchableOpacity>
              {/* <TouchableOpacity style={{ width: 40 }}></TouchableOpacity> */}
            </View>
          </View>
          <ScrollView
            style={{
              backgroundColor: Colors.lightWhiteColor,
              height: height - 150,
              // marginBottom:-30        
            }}
            contentInsetAdjustmentBehavior="automatic">
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
                  this._toNavigate('Waiting Products');
                }}>
                <Text style={this.state.isActive
                  ? [ConversationStyle.offerText, { color: Colors.lightWhiteColor }] : [ConversationStyle.offerText, { color: 'black' }]}>Waiting Products</Text>
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
                <Text style={this.state.isDeactive
                  ? [ConversationStyle.offerText, { color: Colors.lightWhiteColor }] : [ConversationStyle.offerText, { color: 'black' }]}>Active Products</Text>
              </TouchableOpacity>
            </View>
            {/* {this.activityLoading()} */}
            {(this.state.isActive && this.state.waitingProducts && this.state.waitingProducts.length > 0) ? (
              <FlatList
                style={{ top: 30 }}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item }) => this._renderWaitingSectorItem(item)}
                data={this.state.waitingProducts}
              />
            ) :
              this.state.isActive && (
                <View style={{ flex: 1, marginTop: height / 4 }}>
                  <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: Colors.redColor, fontFamily: 'Poppins-Medium' }}>{(this.state.waitingProducts.length==0) ? 'No Products' : <ActivityIndicator size="large" color={Colors.mainBackground} />}</Text>
                </View>)}
            <View style={{ paddingBottom: 20 }}></View>
            {(this.state.isDeactive && this.state.activeProducts && this.state.activeProducts.length > 0) ? (
              <FlatList
                style={{ top: 30 }}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item }) => this._renderActiveSectorItem(item)}
                data={this.state.activeProducts}
              />
            ) :
              this.state.isDeactive && (
                <View style={{ flex: 1, marginTop: height / 4 }}>
                  <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: Colors.redColor, fontFamily: 'Poppins-Medium' }}>{(this.state.activeProducts.length==0) ? 'No Products' : <ActivityIndicator size="large" color={Colors.mainBackground} />}</Text>
                </View>)
            }
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

export default MyProduct;
