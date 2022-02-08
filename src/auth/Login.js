import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  TextInput, ActivityIndicator, BackHandler
} from 'react-native';
import { AppStyle } from '../assets/styles/AppStyle';
import { Styles } from './Styles';
import Icon from 'react-native-vector-icons/EvilIcons';
import { Colors } from '../assets/styles/Colors';
import * as Animatable from 'react-native-animatable';
import { AccessUrl, LoginUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper } from '../HelperApi/Api/HTTPHelper';
import DropdownAlert from 'react-native-dropdownalert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      passWord: '',
      accessKeyData: [],
      loginData: [],
      isLoading: false,
      hidePassword: true
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    let accessKey = HttpHelper(AccessUrl, 'GET');
    accessKey.then(response => {
      if (response.status === "true") {
        this.setState({ accessKeyData: response }, () => {
          try {
            AsyncStorage.setItem('accessKey', JSON.stringify(this.state.accessKeyData), (err) => {
            });
          } catch (error) {
          }
        });
      }
    })
  }
  handleBackPress = () => {
    this.props.navigation.navigate('Landing')
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      let accessKey = HttpHelper(AccessUrl, 'GET');
      accessKey.then(response => {
        if (response.status === "true") {
          this.setState({ accessKeyData: response }, () => {
            try {
              AsyncStorage.setItem('accessKey', JSON.stringify(this.state.accessKeyData), (err) => {
              });
            } catch (error) {
            }
          });
        }
      })
    }
  }
  onLoginPressHandle = () => {
    this.setState({ isLoading: true })
    if (this.state.email == '') {
      this.dropdown.alertWithType('error', 'Error!', 'Please enter your email address');
      this.setState({ isLoading: false })
    } else if (this.state.passWord == '') {
      this.dropdown.alertWithType('error', 'Error!', 'Please enter your password');
      this.setState({ isLoading: false })
    } else {
      var loginData = { 'accesskey': this.state.accessKeyData.key, 'email': this.state.email, 'password': this.state.passWord };
      let auth = HttpHelper(LoginUrl + '?' + 'accesskey' + '=' + loginData.accesskey + '&' + 'loginname' + '=' + loginData.email + '&' + 'loginpass' + '=' + loginData.password, 'POST');
      auth.then(response => {
        if (response && response != null) {
          console.log(response,'loginDataresponse');
          this.setState({ isLoading: true })
          if (response.status === "true") {
            this.setState({ isLoading: false })
            try {
              AsyncStorage.setItem('user', JSON.stringify(response), (err) => {
                setTimeout(() => {
                  this.props.navigation.push('Home')
                }, 0)
              });
            } catch (error) {
            }
          } else {
            this.dropdown.alertWithType('error', 'Error!', response.message);
            this.setState({ isLoading: false })

          }
        } else {
          this.dropdown.alertWithType('error', 'Error!', 'Please Enter All Fields');
          this.setState({ isLoading: false })
        }
      })
    }
  }
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  };
  render() {
    return (
      <>
        <StatusBar
          backgroundColor={Colors.mainBackground}
          barStyle="light-content"
        />
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <ImageBackground
            resizeMode="cover"
            source={require('../assets/images/bg.png')}
            style={Styles.imageBg}>
            <SafeAreaView>
              <View style={Styles.loginContainer}>
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
                <Text style={AppStyle.title}>Login</Text>
                <View style={AppStyle.container}>
                  <TextInput
                    keyboardType="email-address"
                    style={AppStyle.inputText}
                    placeholder={'Email'}
                    autoCapitalize="none"
                    returnKeyType="next"
                    placeholderTextColor={Colors.buttonColor}
                    onChangeText={(email) => this.setState({ email })}
                    onSubmitEditing={() => this.passWord.focus()}
                  />
                  <View style={[AppStyle.inputText, { flexDirection: 'row' }]}>
                    <View style={{ flex: 1 }}>
                      <TextInput
                        style={AppStyle.hidePasswordText}
                        placeholder={'Password'}
                        autoCapitalize="none"
                        returnKeyType="send"
                        placeholderTextColor={Colors.buttonColor}
                        onChangeText={(passWord) => this.setState({ passWord })}
                        ref={(input) => (this.passWord = input)}
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
                  <TouchableOpacity onPress={() => this.onLoginPressHandle()}

                    style={AppStyle.mainButton}>
                    {this.state.isLoading ? (
                      <ActivityIndicator size="large" color={Colors.mainBackground} />
                    ) : (
                        <Text style={AppStyle.buttonText}>Login</Text>)}
                  </TouchableOpacity>
                </View>
                <View style={[AppStyle.forgetView, {}]}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('ForgetPassword');
                    }}>
                    <Text style={AppStyle.buttonText}>Forget Password?</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('Register');
                    }}>
                    <Text style={AppStyle.buttonText}> Register</Text>
                  </TouchableOpacity> */}
                </View>
                <View style={[AppStyle.forgetView, { height: 50 }]}>
                  {/* <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('Register');
                    }}>
                    <Text style={AppStyle.buttonText}> Register</Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            </SafeAreaView>
            <DropdownAlert
              ref={(ref) => (this.dropdown = ref)}
              containerStyle={{
                backgroundColor: '#FF0000',
              }}
              imageSrc={'https://facebook.github.io/react/img/logo_og.png'}
            />
          </ImageBackground>
        </ScrollView>
      </>
    );
  }
}

export default Login;
