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
  KeyboardAvoidingView, ActivityIndicator, Dimensions, Alert, BackHandler, Keyboard
} from 'react-native';
import { AppStyle } from '../assets/styles/AppStyle';
import { Styles } from './Styles';
import Icon from 'react-native-vector-icons/EvilIcons';
import { Colors } from '../assets/styles/Colors';
import { AccessUrl, RegisterUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper } from '../HelperApi/Api/HTTPHelper';
import DropdownAlert from 'react-native-dropdownalert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const { width, height } = Dimensions.get('screen');
import * as Animatable from 'react-native-animatable';

const offset = Platform.OS === 'android' ? -500 : 0;

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      phoneNumber: '',
      email: '',
      passWord: '',
      accessKeyData: [],
      isLoading: false,
      registerData: [],
      isPressed: false,
      hidePassword: true,
      isCorrectPassword: false,
      sEmailValidate: false
    };
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    // this.autoScroll();
    let accessKey = HttpHelper(AccessUrl, 'GET');
    accessKey.then((response) => {
      this.setState({ isLoading: true });
      if (response.status === 'true') {
        this.setState({ accessKeyData: response, isLoading: false }, () => {
          try {
            AsyncStorage.setItem(
              'accessKey',
              JSON.stringify(this.state.accessKeyData),
              (err) => { },
            );
          } catch (error) { }
        });
      } else {
        this.setState({ accessKeyData: {}, isLoading: false });
      }
    });
  }
  handleBackPress = () => {
    this.props.navigation.navigate('Landing')
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  // _keyboardDidShow () {
  //   alert('Keyboard Shown');
  // }

  // _keyboardDidHide () {
  //   this.refs._scrollView.scrollTo({x: 0, y: 0, animated: true}); 
  //   }
  navigate = () => {
    this.props.navigation.navigate('Login');
  };
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  };

  onRegisterHandle = () => {
    this.setState({
      isPressed: true
    })
    if (
      this.state.accessKeyData &&
      this.state.accessKeyData != null
    ) {
      if (this.state.firstName == '') {
        this.dropdown.alertWithType('error', 'Error!', 'Please enter your first Name');
        this.setState({ isPressed: false })
      } else if (this.state.phoneNumber == '') {
        this.dropdown.alertWithType('error', 'Error!', 'Please enter your phoneNumber');
        this.setState({ isPressed: false })
      } else if (this.state.email == '') {
        this.dropdown.alertWithType('error', 'Error!', 'Please enter your email');
        this.setState({ isPressed: false })
      } else if (this.state.isEmailValidate === false) {
        this.dropdown.alertWithType('error', 'Error!', 'Invalid email address');
        this.setState({ isPressed: false })
      } else if (this.state.passWord == '') {
        this.dropdown.alertWithType('error', 'Error!', 'Please enter your password');
        this.setState({ isPressed: false })
      }
      else if (this.state.isCorrectPassword === false) {
        this.dropdown.alertWithType('error', 'Error!', 'Password should have Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character !!');
        this.setState({ isPressed: false })
      } else {
        var data = {
          accesskey: this.state.accessKeyData.key,
          firstName: this.state.firstName,
          email: this.state.email,
          phoneNumber: this.state.phoneNumber,
          password: this.state.passWord,
        };
        let sighnUp = HttpHelper(
          RegisterUrl +
          '?' +
          'accesskey' +
          '=' +
          data.accesskey +
          '&' +
          'name' +
          '=' +
          data.firstName +
          '&' +
          'email' +
          '=' +
          data.email +
          '&' +
          'phone' +
          '=' +
          data.phoneNumber +
          '&' +
          'password' +
          '=' +
          data.password,
          'POST',
        );
        sighnUp.then((response) => {
          this.setState({ isPressed: true })
          if (response && response != null) {
            if (response.status === 'true') {
              Alert.alert(
                '',
                'Registered Successfully, Check your email to activate your account',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      this.props.navigation.navigate('Login');
                    },
                  },
                ],
                { cancelable: false },
              );


              this.setState({ isPressed: false })
              try {
                AsyncStorage.setItem(
                  'user',
                  JSON.stringify(response),
                  (err) => { });
              } catch (error) { }
            } else {
              this.dropdown.alertWithType(
                'error',
                'Error!',
                response.message,
              );
              this.setState({ isPressed: false })
            }
          } else {
            this.dropdown.alertWithType(
              'error',
              'Error!',
              'Please Enter All Fields',
            );
            this.setState({ isPressed: false })
          }
        });

      }
    }
  }
  addPasswordValidation = (passWord) => {
    var numberText = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const validatePassword = numberText.test(passWord)
    if (validatePassword) {
      this.setState({
        passWord: passWord,
        isCorrectPassword: true
      });
    } else {
      this.setState({
        passWord: passWord,
        isCorrectPassword: false
      })
    }

  }
  validate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) == false) {
      this.setState({ email: text, isEmailValidate: false })
    }
    else {
      this.setState({ email: text, isEmailValidate: true })
    }
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView>
            <ImageBackground
              resizeMode="cover"
              source={require('../assets/images/bg.png')}
              style={{ width: width, }}>
              <KeyboardAvoidingView
                enabled>
                <View style={[Styles.loginContainer]}>
                  <TouchableOpacity
                    style={[AppStyle.closePanel, { alignSelf: 'flex-start', }]}
                    onPress={() => this.props.navigation.navigate('Landing')}>
                    <AntDesign
                      name="arrowleft"
                      style={AppStyle.iconShadow}
                      size={30}
                      color="white"></AntDesign>
                  </TouchableOpacity>
                  <Animatable.Image
                    animation="bounceIn"
                    duration={1500}
                    style={AppStyle.logoImage}
                    source={require('../assets/images/logo.png')}
                  />
                  <Text style={AppStyle.title}>Register</Text>
                  <View style={AppStyle.container}>
                    <TextInput
                      style={AppStyle.inputText}
                      placeholder={'First Name & Last Name'}
                      placeholderTextColor={Colors.buttonColor}
                      onSubmitEditing={() => this.phoneNumber.focus()}
                      onChangeText={(firstName) => this.setState({ firstName })}
                    />
                    <TextInput
                      style={AppStyle.inputText}
                      keyboardType="number-pad"
                      placeholder={'Phone Number'}
                      placeholderTextColor={Colors.buttonColor}
                      ref={(input) => (this.phoneNumber = input)}
                      onSubmitEditing={() => this.email.focus()}
                      onChangeText={(phoneNumber) =>
                        this.setState({ phoneNumber })
                      }
                    />
                    <TextInput
                      keyboardType="email-address"
                      style={AppStyle.inputText}
                      placeholder={'Email'}
                      placeholderTextColor={Colors.buttonColor}
                      ref={(input) => (this.email = input)}
                      onSubmitEditing={() => this.passWord.focus()}
                      onChangeText={this.validate}
                    />
                    <View style={[AppStyle.inputText, { flexDirection: 'row' }]}>
                      <View style={{ flex: 1 }}>
                        <TextInput
                          style={AppStyle.hidePasswordText}
                          placeholder={'Password'}
                          placeholderTextColor={Colors.buttonColor}
                          ref={(input) => (this.passWord = input)}
                          onChangeText={this.addPasswordValidation}
                          secureTextEntry={this.state.hidePassword}
                        />
                      </View>
                      <TouchableOpacity
                        style={AppStyle.buttonHide}
                        onPress={this.managePasswordVisibility}>
                        <Text style={{ textAlign: 'left' }}>
                          {this.state.hidePassword ? (
                            <FontAwesome
                              name="eye-slash"
                              size={20}
                              color={Colors.buttonColor}
                              style={AppStyle.iconText}
                            />
                          ) : (
                              <AntDesign
                                name="eye"
                                size={20}
                                color={Colors.placeholderColor}
                                style={AppStyle.iconText}
                              />
                            )}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={this.onRegisterHandle}
                      style={[AppStyle.mainButton]}>
                      {this.state.isPressed ? (
                        <ActivityIndicator size="large" color={Colors.mainBackground} />
                      ) : (
                          <Text style={AppStyle.buttonText}>Register</Text>)}
                    </TouchableOpacity>
                    <View style={{ height: 100 }}></View>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </ImageBackground>
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

export default Register;
