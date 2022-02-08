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
  TextInput, Keyboard, ActivityIndicator, Alert, BackHandler
} from 'react-native';
import { AppStyle } from '../assets/styles/AppStyle';
import { Styles } from './Styles';
import Icon from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from '../assets/styles/Colors';
import { ChangePasswordUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper } from '../HelperApi/Api/HTTPHelper';
import DropdownAlert from 'react-native-dropdownalert';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: 'tamil@gmail.com',
      isCorrect: true,
      hidePassword: true,
      confirmHidePassword: true,
      confirmPassword: '',
      newPassword: '',
      otp: '',
      currentPassword: '',
      currentHidePassword: true,
      accessKeyDetails: {},
      isLoading: false,
      isCorrectPassword: false
    };
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    AsyncStorage.getItem('user', (err, userDetails) => {
      if (userDetails != null) {
        this.setState({ userDetails: JSON.parse(userDetails) }, () => {
        });
      }
    });
    AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
      if (accessKeyDetails != null) {
        this.setState({ accessKeyDetails: JSON.parse(accessKeyDetails) }, () => {
        });
      }
    });
  }
  handleBackPress = () => {
    this.props.navigation('Home')
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  };
  manageCurrentPasswordVisibility = () => {
    this.setState({ currentHidePassword: !this.state.currentHidePassword });
  };
  manageConfirmPasswordVisibility = () => {
    this.setState({ confirmHidePassword: !this.state.confirmHidePassword });
  };
  onChangePressHandle() {
    Keyboard.dismiss
    this.setState({ isLoading: true })
    if (this.state.newPassword != '' && this.state.confirmPassword != '') {
      if (this.state.newPassword != this.state.confirmPassword) {
        this.dropdown.alertWithType('error', 'Error!', 'New password and Confirm password do not match.')
        this.setState({ isLoading: false })

      } else if (this.state.isCorrectPassword === false) {
        this.dropdown.alertWithType('error', 'Error!', 'Password should have Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character !!');
        this.setState({ isPressed: false })
      }
      else {
        var changePasswordData = { 'accesskey': this.state.accessKeyDetails.key, 'currentPassword': this.state.currentPassword, 'newPassword': this.state.newPassword };
        let changePassword = HttpHelper(ChangePasswordUrl + '?' + 'accesskey' + '=' + changePasswordData.accesskey + '&' + 'currentpass' + '=' + changePasswordData.currentPassword + '&' + 'newpass' + '=' + changePasswordData.newPassword, 'POST');
        changePassword.then(response => {
          this.setState({ isLoading: true })
          if (response) {
            if (response.status === "true") {
              this.setState({ isLoading: false }, () => {
                Alert.alert(
                  '',
                  response.message,
                  [
                    {
                      text: 'OK', onPress: () => {
                        this.props.navigation.push("Home")
                      }
                    },
                  ],
                  { cancelable: false }
                );
              })

            } else {
              this.dropdown.alertWithType('error', 'Error!', response.error.message);
              this.setState({ isLoading: false })
            }
          } else {
            this.dropdown.alertWithType('error', 'Error!', 'Please Enter All Fields');
            this.setState({ isLoading: false })
          }
        })
      }
    } else {
      this.dropdown.alertWithType('error', 'Error!', 'Please fill all fields.')
      this.setState({ isLoading: false })

    }
  }
  addPasswordValidation = (passWord) => {
    var numberText = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const validatePassword = numberText.test(passWord)
    if (validatePassword) {
      this.setState({
        newPassword: passWord,
        isCorrectPassword: true
      });
    } else {
      this.setState({
        newPassword: passWord,
        isCorrectPassword: false
      })
    }
  }
  render() {
    const hiddenEmail = this.state.emailAddress.slice(
      this.state.emailAddress.length - 12,
    );
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <SafeAreaView>
            <View style={[Styles.loginContainer, { marginTop: 20 }]}>
              <TouchableOpacity
                style={[AppStyle.closePanel, { alignSelf: 'flex-start' }]}
                onPress={() => this.props.navigation.goBack()}>
                <AntDesign
                  name="left"
                  style={AppStyle.iconShadow}
                  size={30}
                  color="black"></AntDesign>
              </TouchableOpacity>
              <Text style={AppStyle.titleView}>Change Password</Text>
              <View style={AppStyle.passwordView}>
                <TextInput
                  onChangeText={(currentPassword) => this.setState({ currentPassword })}
                  placeholderTextColor={Colors.placeHolderColor}
                  value={this.state.currentPassword}
                  placeholder="Current Password"
                  style={AppStyle.passwordText}
                  secureTextEntry={this.state.currentHidePassword}
                />
                <TouchableOpacity
                  style={{ justifyContent: 'flex-end' }}
                  onPress={() => this.manageCurrentPasswordVisibility()}>
                  <View style={AppStyle.iconView}>
                    <Text style={AppStyle.eyeIcon}>
                      {this.state.currentHidePassword ? (
                        <FontAwesome
                          name="eye-slash"
                          size={25}
                          color={Colors.placeholderColor}
                          style={{ width: 33, padding: 10 }}
                        />
                      ) : (
                          <AntDesign
                            name="eye"
                            size={25}
                            color={Colors.buttonColor}
                            style={{ width: 33, padding: 10 }}
                          />
                        )}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={AppStyle.passwordView}>
                <TextInput
                  onChangeText={this.addPasswordValidation}
                  placeholderTextColor={Colors.placeHolderColor}
                  value={this.state.newPassword}
                  placeholder="New Password"
                  style={AppStyle.passwordText}
                  secureTextEntry={this.state.hidePassword}
                />
                <TouchableOpacity
                  style={{ justifyContent: 'flex-end' }}
                  onPress={() => this.managePasswordVisibility()}>
                  <View style={AppStyle.iconView}>
                    <Text style={AppStyle.eyeIcon}>
                      {this.state.hidePassword ? (
                        <FontAwesome
                          name="eye-slash"
                          size={25}
                          color={Colors.placeholderColor}
                          style={{ width: 33, padding: 10 }}
                        />
                      ) : (
                          <AntDesign
                            name="eye"
                            size={25}
                            color={Colors.buttonColor}
                            style={{ width: 33, padding: 10 }}
                          />
                        )}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={AppStyle.passwordView}>
                <TextInput
                  onChangeText={(confirmPassword) =>
                    this.setState({ confirmPassword })
                  }
                  placeholderTextColor={Colors.placeholderColor}
                  value={this.state.confirmPassword}
                  placeholder="Confirm Password"
                  style={AppStyle.passwordText}
                  secureTextEntry={this.state.confirmHidePassword}
                />
                <TouchableOpacity
                  style={{ justifyContent: 'flex-end' }}
                  onPress={() => this.manageConfirmPasswordVisibility()}>
                  <View style={AppStyle.iconView}>
                    <Text style={AppStyle.eyeIcon}>
                      {this.state.confirmHidePassword ? (
                        <FontAwesome
                          name="eye-slash"
                          size={25}
                          color={Colors.placeholderColor}
                          style={{ width: 33, padding: 10 }}
                        />
                      ) : (
                          <AntDesign
                            name="eye"
                            size={25}
                            color={Colors.buttonColor}
                            style={{ width: 33, padding: 10 }}
                          />
                        )}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {/* <View>
                <Text style={AppStyle.otpText}>
                  OTP will send to your mail{'******' + hiddenEmail}
                </Text>
              </View>
              <View style={AppStyle.passwordView}>
                <TextInput
                  onChangeText={(otp) => this.setState({otp})}
                  placeholderTextColor={Colors.placeholderColor}
                  value={this.state.otp}
                  placeholder="OTP"
                  style={AppStyle.passwordText}
                />
                <TouchableOpacity
                  style={{justifyContent: 'flex-end'}}
                  onPress={() => {}}>
                  <View style={AppStyle.iconView}>
                    <Text style={AppStyle.resendText}>Resend</Text>
                  </View>
                </TouchableOpacity>
              </View> */}
              <View style={AppStyle.container}>
                <TouchableOpacity
                  onPress={() => this.onChangePressHandle()}
                  style={[
                    AppStyle.mainButton,
                    { backgroundColor: Colors.redColor },
                  ]}>
                  {this.state.isLoading ? (
                    <ActivityIndicator size="large" color={Colors.mainBackground} />
                  ) : (
                      <Text style={AppStyle.buttonText}>Change</Text>)}
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
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

export default ChangePassword;
