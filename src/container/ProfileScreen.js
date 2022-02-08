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
  Dimensions, Alert, ActivityIndicator, Modal, BackHandler
} from 'react-native';
import { AppStyle } from '../assets/styles/AppStyle';
import { FilterStyle } from '../assets/styles/FilterStyle';
import { ProfileStyle } from '../assets/styles/ProfileStyle';
import { Styles } from '../auth/Styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../assets/styles/Colors';
import SecondaryHeader from '../components/SecondaryHeader';
import * as Animatable from 'react-native-animatable';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
const { width, height } = Dimensions.get('screen');
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileUploadUrl, ImageUploadUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper, HttpMultiPartHelper } from '../HelperApi/Api/HTTPHelper';
import DropdownAlert from 'react-native-dropdownalert';
import AntDesign from 'react-native-vector-icons/AntDesign';
var fileData;
const options = {
  title: 'Select Avatar',
  // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
var genderInfo = [
  {
    genderId: 1,
    label: 'Male',
    isSelected: true,
  },
  {
    genderId: 2,
    label: 'Female',
    isSelected: true,
  },
];
class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    var params = this.props.route.params;
    this.state = {
      filterData: [],
      profilePic: '',
      avatarSource: {},
      firstName: '',
      lastName: '',
      genderType: genderInfo,
      isSelected: false,
      mobileNumber: '',
      emailAddress: '',
      isImageUpload: false,
      file: '',
      accessKeyDetails: {},
      isEmailEdit: false,
      isMobileEdit: false,
      isInfoEdit: false,
      gender: '',
      isPressed: false,
      imagePath: '',
      isImagePressed: false,
      userDetails: [],
      isLoading: true,
      isHome: params && params.isHome ? params.isHome : false,
      isSetting: params && params.isSetting ? params.isSetting : false,
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    let findGenderType = genderInfo.filter((e) => e.isSelected === true);
    if (findGenderType && findGenderType.length > 0) {
      this.setState({ gender: findGenderType[0].label })
    }
    AsyncStorage.getItem('user', (err, userDetails) => {
      if (userDetails != null) {
        this.setState({ userDetails: JSON.parse(userDetails) }, () => {
          this.setState({
            isLoading: false,
            firstName: this.state.userDetails && this.state.userDetails.user ? this.state.userDetails.user.name : '',
            mobileNumber: this.state.userDetails && this.state.userDetails.user ? this.state.userDetails.user.mobile : '',
            emailAddress: this.state.userDetails && this.state.userDetails.user ? this.state.userDetails.user.email : '',
            image: this.state.userDetails && this.state.userDetails.user ? this.state.userDetails.user.image : '',
            isImageUpload: this.state.userDetails && this.state.userDetails.user && this.state.userDetails.user.image ? true : false
          })
        });
      }
    });
    AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
      if (accessKeyDetails != null) {
        this.setState({
          accessKeyDetails: JSON.parse(accessKeyDetails),
          isLoading: false,
        }, () => {
        });
      }
    });

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState({
        isSetting: nextProps.route.params && nextProps.route.params.isSetting ? nextProps.route.params.isSetting : false,
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
  }

  onProfileUpdateHandle = () => {
    this.setState({ isPressed: true, isImagePressed: true });
    if (this.state.accessKeyDetails && this.state.accessKeyDetails != null && this.state.firstName != '' && this.state.emailAddress != '' && this.state.mobileNumber != '' && this.state.gender != '') {
      var data = {
        'accesskey': this.state.accessKeyDetails.key,
        'fname': this.state.firstName,
        'lname': this.state.lastName,
        'email': this.state.emailAddress,
        'mobile': this.state.mobileNumber,
        'genderValue': this.state.gender
      };
      let profileUpdate = HttpHelper(ProfileUploadUrl + 'accesskey' + '=' + data.accesskey + '&' + 'name' + '=' + data.fname + '&' + 'email' + '=' + data.email + '&' + 'phone' + '=' + data.mobile + '&' + 'gender' + '=' + data.genderValue, 'POST');
      profileUpdate.then(response => {
        if (response && response != null) {
          if (response.status === "true") {
            if (this.state.isImageUpload) {
              let imageUpload = HttpMultiPartHelper(ImageUploadUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'POST', fileData);
              imageUpload.then(imageResponse => {
                this.setState({
                  isImagePressed: false,
                  image: imageResponse != null && imageResponse.user && imageResponse.user.image != null ? imageResponse.user.image : this.state.image,
                  isPressed: false,
                  firstName: (response && response.user.name) ? response.user.name : '',
                  emailAddress: (response && response.user.email) ? response.user.email : '',
                  mobileNumber: (response && response.user.mobile) ? response.user.mobile : '',
                  isInfoEdit: false,
                  isEmailEdit: false,
                  isMobileEdit: false
                }, () => {
                  Alert.alert(
                    '',
                    response.message,
                    [
                      {
                        text: 'OK', onPress: () => {
                          try {
                            AsyncStorage.setItem('user', JSON.stringify(response), (err) => {
                              this.props.navigation.push('Home')
                            });
                          } catch (error) {
                          }
                        }
                      },
                    ],
                    { cancelable: false }
                  );
                })
              })
            }
          } else {
            this.dropdown.alertWithType('error', 'Error!', response.message);
            this.setState({
              isPressed: false, isInfoEdit: false,
              isEmailEdit: false,
              isMobileEdit: false
            })
          }
        } else {
          this.dropdown.alertWithType('error', 'Error!', 'Please Enter All Fields');
          this.setState({
            isPressed: false,
            isInfoEdit: false,
            isEmailEdit: false,
            isMobileEdit: false
          })
        }
      });
    }
    else {
      this.dropdown.alertWithType('error', 'Error!', 'Please Enter All Fields!!');
      this.setState({
        isPressed: false,
        isInfoEdit: false,
        isEmailEdit: false,
        isMobileEdit: false
      })
    }
  }
  _selectImage = () => {
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        this.setState({
          isImagePressed: false
        })
      } else if (response.error) {
        this.setState({
          isImagePressed: false
        })
      } else if (response.customButton) {
        this.setState({
          isImagePressed: false
        })
      } else {
        const source = { uri: response.uri };
        this.setState({
          profilePic: {
            uri: response.uri,
            name: response.fileName,
            type: response.type,
          },
        });
        this.setState(
          {
            avatarSource: source,
            file: response,
            isImageUpload: true,
          },
          () => {
            fileData = new FormData();
            fileData.append('profile', {
              uri: this.state.file.uri,
              name: this.state.file.fileName,
              type: this.state.file.type
            });
            // if (this.state.isImageUpload) {
            //   let imageUpload = HttpMultiPartHelper(ImageUploadUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'POST', fileData);
            //   imageUpload.then(imageResponse => {
            //     if (imageResponse != null && imageResponse.user && imageResponse.user.image != null) {
            //       this.setState({
            //         isImagePressed: false,
            //         image: imageResponse.user.image
            //       })
            //     } else {
            //       this.setState({ image: '', isImagePressed: false })
            //     }
            //   })
            // }
          })
      };
    })
  }
  onPress = (data) => {
    let findGenderType = data.filter((e) => e.selected === true);
    if (findGenderType && findGenderType.length > 0) {
      this.setState({
        gender: findGenderType[0].label
      })
    }
  }
  _onPressEdit = (type) => {
    if (type === 'email') {
      this.setState({ isEmailEdit: true })
    } else if (type === 'mobile') {
      this.setState({ isMobileEdit: true })
    } else if (type === 'info') {
      this.setState({ isInfoEdit: true })
    } else {
      this.setState({ isEmailEdit: false, isMobileEdit: false, isInfoEdit: false })
    }
  };
  _onNavigate = () => {
    if (this.state.isSetting) {
      this.props.navigation.goBack()
    } else {
      this.props.navigation.push('Home')
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Modal transparent={true} visible={this.state.isLoading}>
          <View style={{ backgroundColor: 'rgba(22,22,22,0.4)', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
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
          <SafeAreaView style={AppStyle.barStyle}>
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
                <Text numberOfLines={1} style={AppStyle.secondaryHeaderTitle}>{"Profile"}</Text>
                <TouchableOpacity style={{ width: 40 }}></TouchableOpacity>

              </View>
            </View>
            <ScrollView
              style={{ backgroundColor: Colors.lightWhiteColor }}
              contentInsetAdjustmentBehavior="automatic">
              <View style={ProfileStyle.imageView}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <View>
                    <Image
                      style={ProfileStyle.profileImage}
                      resizeMode="cover"
                      source={
                        this.state.profilePic.uri
                          ? this.state.avatarSource
                          : { uri: this.state.profilePic.uri ? this.state.profilePic.uri : this.state.image }
                      }
                    />
                    <View style={ProfileStyle.cameraIconView}>
                      <TouchableOpacity onPress={() => this._selectImage()}>
                        <MaterialCommunityIcons
                          name="pencil-circle"
                          size={20}
                          color={Colors.darkColor}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {this.state.isImagePressed && (
                    <ActivityIndicator size="small" color={Colors.mainBackground} />
                  )}
                  <View style={{ flexDirection: 'column', marginTop: 20 }}>
                    <Text style={ProfileStyle.profileNameText}>Hello,</Text>
                    <Text style={[ProfileStyle.profileNameText, { textAlign: 'center', justifyContent: 'center' }]}>{this.state.firstName}</Text>
                  </View>
                </View>
                <View
                  style={[
                    ProfileStyle.personalInfoView,
                    { borderBottomColor: Colors.buttonColor, borderBottomWidth: 2 },
                  ]}>
                  <Text style={{ fontSize: 18 }}>Personal Information</Text>
                  <TouchableOpacity onPress={() => {
                    this._onPressEdit('info')
                  }} >
                    <Text
                      style={{
                        fontSize: 18,
                        color: Colors.buttonColor,
                        fontWeight: 'bold',
                      }}>
                      Edit
                </Text>
                  </TouchableOpacity>
                </View>
                <View style={ProfileStyle.editView}>
                  <TextInput
                    editable={this.state.isInfoEdit}
                    style={ProfileStyle.textInput}
                    placeholderTextColor={Colors.placeholderColor}
                    placeholder="First Name"
                    onChangeText={(firstName) => this.setState({ firstName })}
                    // onSubmitEditing={() => lastName.focus()}
                    defaultValue={this.state.firstName}
                  />
                  <TextInput
                    editable={this.state.isInfoEdit}
                    style={ProfileStyle.textInput}
                    placeholderTextColor={Colors.placeholderColor}
                    placeholder="Last Name "
                    onChangeText={(lastName) => this.setState({ lastName })}
                    returnKeyType="go"
                    defaultValue={this.state.lastName}
                  />
                </View>
                <View style={ProfileStyle.personalInfoView}>
                  <Text style={{ fontSize: 18 }}>Your Gender</Text>
                </View>
                <View style={ProfileStyle.radioButtonView}>
                  <RadioGroup
                    radioButtons={this.state.genderType}
                    onPress={this.onPress}
                    flexDirection="row"
                  />
                </View>
                <View style={ProfileStyle.personalInfoView}>
                  <Text style={{ fontSize: 18 }}>Email Address</Text>
                  {/* <TouchableOpacity onPress={() => {
                    this._onPressEdit('email')
                  }}>
                    <Text style={ProfileStyle.editText}>Edit</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('ChangePassword');
                  }}>
                    <Text numberOfLines={1} style={[ProfileStyle.editText,]}>Change Password</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  editable={this.state.isEmailEdit}
                  style={ProfileStyle.mobileInput}
                  placeholderTextColor={Colors.placeholderColor}
                  placeholder="Your Email"
                  onChangeText={(emailAddress) => this.setState({ emailAddress })}
                  defaultValue={this.state.emailAddress}
                  keyboardType="email-address"
                />
                <View style={ProfileStyle.personalInfoView}>
                  <Text style={{ fontSize: 18 }}>Mobile Number</Text>
                  <TouchableOpacity onPress={() => {
                    this._onPressEdit('mobile')
                  }}>
                    <Text style={ProfileStyle.editText}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  editable={this.state.isMobileEdit}
                  style={ProfileStyle.mobileInput}
                  placeholderTextColor={Colors.placeholderColor}
                  placeholder={'e.g:+91 123456789'}
                  onChangeText={(mobileNumber) => this.setState({ mobileNumber })}
                  defaultValue={this.state.mobileNumber}
                  keyboardType="number-pad"
                />
                <TouchableOpacity
                  onPress={() => {
                    this.onProfileUpdateHandle();
                  }}
                  style={AppStyle.applySaveButton}>{
                    this.state.isPressed ?
                      <ActivityIndicator size="large" color={Colors.mainBackground} /> :
                      <Text style={AppStyle.buttonText}>Save</Text>
                  }
                </TouchableOpacity>
              </View>
            </ScrollView>
            <DropdownAlert
              ref={(ref) => (this.dropdown = ref)}
              containerStyle={{
                backgroundColor: '#FF0000',
              }}
              imageSrc={'https://facebook.github.io/react/img/logo_og.png'}
            />
          </SafeAreaView>
        </>
      );
    }
  }
}


export default ProfileScreen;
