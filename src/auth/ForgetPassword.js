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
  TextInput, Alert, ActivityIndicator, BackHandler
} from 'react-native';
import { AppStyle } from '../assets/styles/AppStyle';
import { Styles } from './Styles';
import Icon from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from '../assets/styles/Colors';
import FloatingLabel from 'react-native-floating-labels';
import { AccessUrl, ForgotUrl, AllUsersUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper } from '../HelperApi/Api/HTTPHelper';
import DropdownAlert from 'react-native-dropdownalert';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: '',
      isCorrect: false,
      isLoading: false,
      userDetails: [],
      accessKeyData: [],
      allUserSuccessData: []
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    let accessKey = HttpHelper(AccessUrl, 'GET');
    accessKey.then(response => {
      if (response.status === "true") {
        this.setState({ accessKeyData: response }, () => {
          let allUserData = HttpHelper(
            AllUsersUrl +
            '?' +
            'accesskey' +
            '=' +
            this.state.accessKeyData.key,
            'POST',
          );
          allUserData.then(response => {
            if (response.status === 'true') {
              this.setState(
                { allUserSuccessData: response.users, });
            } else {
              this.setState({
                allUserSuccessData: {},
              });
            }
          });
        });
      } else {
        this.setState({ accessKeyData: {} });
      }
    })

  }
  handleBackPress = () => {
    this.props.navigation.navigate('Login')
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  onforgotPressHandle = () => {
    this.setState({ isLoading: true })
    if (this.state.emailAddress == '') {
      this.setState({ isLoading: false })
      this.dropdown.alertWithType('error', 'Error!', 'Please enter your email address ');
    } else {
      var forgotData = { 'accesskey': this.state.accessKeyData.key, 'username': this.state.emailAddress };
      let forget = HttpHelper(ForgotUrl + '?' + 'accesskey' + '=' + forgotData.accesskey + '&' + 'username' + '=' + forgotData.username, 'GET');
      forget.then(response => {
        this.setState({ isLoading: true })
        if (response.status === "true") {
          this.setState({ forgotData: response, isLoading: false }, () => {
            if (this.state.forgotData && this.state.forgotData != null) {
              Alert.alert(
                '',
                this.state.forgotData.message,
                [
                  {
                    text: 'OK', onPress: () => {
                      this.props.navigation.navigate("Login")
                    }
                  },
                ],
                { cancelable: false }
              );
            } else {
              this.setState({ isLoading: false })
              this.dropdown.alertWithType('error', 'Error!', 'Please Enter All Fields');
            }
          });
        } else {
          this.setState({ forgotData: {}, isLoading: false });
          this.dropdown.alertWithType('error', 'Error!', response.message);
        }
      })
    }
  }
  handleChange = (event) => {
    this.setState({ emailAddress: event.nativeEvent.text });
    if (this.state.allUserSuccessData) {
      var selectedUser = this.state.allUserSuccessData.filter(e => e.email === event.nativeEvent.text)
      if (selectedUser && selectedUser.length > 0) {
        this.setState({
          isCorrect: true
        })
      } else {
        this.setState({
          isCorrect: false
        })
      }
    }
  };
  render() {
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
              <Text style={AppStyle.titleView}>Forget Password</Text>
              <Text style={AppStyle.contentText}>
                Please enter your registered email to reset
                your password
              </Text>
              <View style={AppStyle.floatingLabelView}>
                <View style={{ width: '90%' }}>
                  <FloatingLabel
                    labelStyle={AppStyle.labelStyle}
                    inputStyle={AppStyle.inputStyle}
                    onChange={(event) => this.handleChange(event)}
                    keyboardType="email-address"
                    style={
                      this.state.isCorrect
                        ? [
                          AppStyle.floatingLabel,
                          { borderColor: Colors.greenColor },
                        ]
                        : [
                          AppStyle.floatingLabel,
                          { borderColor: Colors.buttonColor },
                        ]
                    }
                    value={this.state.emailAddress}>
                    Email Id{' '}
                  </FloatingLabel>
                </View>
                {this.state.isCorrect ? (
                  <View
                    style={
                      this.state.isCorrect
                        ? [AppStyle.emailView, { borderColor: Colors.greenColor }]
                        : [
                          AppStyle.emailView,
                          { borderColor: Colors.buttonColor },
                        ]
                    }>
                    <AntDesign
                      name="checkcircle"
                      size={18}
                      color={Colors.greenColor}
                      style={[AppStyle.tickImage, { marginLeft: 5, width: 33 }]}
                    />
                  </View>
                ) : (
                    <View
                      style={[
                        AppStyle.emailView,
                        { borderColor: Colors.buttonColor },
                      ]}></View>
                  )}
              </View>
              <View style={AppStyle.container}>
                <TouchableOpacity onPress={() => this.onforgotPressHandle()}
                  style={AppStyle.mainButton}>
                  {this.state.isLoading ? (
                    <ActivityIndicator size="large" color={Colors.mainBackground} />
                  ) : (
                      <Text style={AppStyle.buttonText}>Reset Password</Text>)}
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

export default ForgetPassword;
