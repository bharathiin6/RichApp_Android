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
  Dimensions,
  Picker,ActivityIndicator,Alert
} from 'react-native';
import { AppStyle } from '../../assets/styles/AppStyle';
import { AddProductStyle } from '../../assets/styles/AddProductStyle';
import { Colors } from '../../assets/styles/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SecondaryHeader from '../../components/SecondaryHeader';
import Octicons from 'react-native-vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddProductsDetailsUrl, AddProductImageUrl,UpdateProductUrl,UpdateImageUrl } from '../../HelperApi/Api/APIConfig';
import { HttpHelper, HttpMultiPartHelper } from '../../HelperApi/Api/HTTPHelper';
import DropdownAlert from 'react-native-dropdownalert';


var fileData1 = [];
var fileData2 = [];
var fileData3 = [];
var fileData4 = [];
var fileData5 = [];
var weightId = '';
var attemptId = '';
var manufactureId = '';
var countId = '';
var notUsedId = '';
var weightType = '';
var attemptType = '';
var manufactureType = '';
var countType = '';
var notUsedType = '';
var subWeightId = '';
var subAttemptId = '';
var subManufactureId = '';
var subCountId = '';
var subNotUsedId = '';
var subWeightType = '';
var subAttemptType = '';
var subManufactureType = '';
var subCountType = '';
var subNotUsedType = '';
const { width, height } = Dimensions.get('screen');

const options = {
  title: 'Select Avatar',
  // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
var index = 0
class UpdateProduct extends Component {
  constructor(props) {
    super(props);
    var params = this.props.route.params;
    this.state = {
      firstName: '',
      categoryId: '11',
      profilePic: '',
      avatarSource: {},
      isImagePressed: false,
      profilePic: '',
      file: '',
      accessKeyDetails: {},
      isImageUpload: true,
      isLoading: false,
      categoryDetails:[],
      subCategoryDetail: [],
      subCategoryId: "12",
      productAddDetails: [],
      productName: 'TamilProduct',
      productSlug: 'Tamil',
      productDes: 'Testinggg',
      productLocation:'Salem',
      imagePath1: '',
      imagePath2: '',
      imagePath3: '',
      imagePath4: '',
      imagePath5: '',
      profilePic1: '',
      profilePic2: '',
      profilePic3: '',
      profilePic4: '',
      profilePic5: '',
      avatarSource2: {},
      avatarSource3: {},
      avatarSource4: {},
      avatarSource5: {},
      isImageSave: false,
      imageSection: false,
      clicks: '0',
      valueArray: [],
      subWeightId: "13",
      subAttemptId: '1',
      subManufactureId: '',
      subCoinId: "21",
      isDisable:false,
      isPressed :false,
      categoryWeightId :"31",
      categoryAttemptId :'1' ,
      categoryCountId:"22",
      categoryManufactureId:'1',
       categoryNotUsedId:'2',
       productPrice:'1000',
       updateProductData:[]
    }
  }

  getDetails = () => {
    AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
      if (accessKeyDetails != null) {
        this.setState({
          accessKeyDetails: JSON.parse(accessKeyDetails),
          isLoading: true,
        }, () => {
          let productDetails = HttpHelper(
            AddProductsDetailsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
          productDetails.then((response) => {
            this.setState({ isLoading: true })
            if (response.status === 'true') {
              this.setState({
                categoryDetails: response.Category,
                isLoading: false
              },()=>{
                if (this.state.categoryDetails && this.state.categoryDetails.length > 0) {
                  var selectedCategory = this.state.categoryDetails.filter(e => e.id === this.state.categoryId);
                }
                if(selectedCategory &&selectedCategory[0] ){
                  this.setState({
                    categoryId:selectedCategory[0].id,
                    subCategoryDetail: selectedCategory[0].subcat,
                  }, () => {
                    this._renderProperty(this.state.categoryId)
                  });
                }
               
              })
            } else {
              this.setState({
                categoryDetails: [],
                isLoading: false
              })
            }
          });
        });
      }
    });
  }
  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      this.getDetails();
    })
  }
  _renderPickerItem() {
    if (
      this.state.categoryDetails != null &&
      this.state.categoryDetails.length > 0
    ) {
      return this.state.categoryDetails.map(item => (
        <Picker.Item label={item.title} value={item.id} key={item.id} />
      ));
    }
  }
  updatePickerItem = id => {
    if (this.state.categoryDetails && this.state.categoryDetails.length > 0) {
      var selectedCategory = this.state.categoryDetails.filter(e => e.id === id);
    }
    this.setState({
      categoryId: id,
      subCategoryDetail: selectedCategory[0].subcat,
      // categoryName:selectedCategory[0].c
    }, () => {
      this._renderProperty(this.state.categoryId)
    });
  };


  renderBottomComponent = () => {
    if (this.state.imageSection && this.state.valueArray) {
      return this.state.valueArray.map((a, index) => {
        return (
          <TouchableOpacity style={{
            borderWidth: 1,
            borderColor: Colors.placeholderColor,
            height: 100,
            width: '30%',
            alignItems: 'center',
            justifyContent: 'center',
          }} onPress={() => this.selectImage(index)}>

            <View key={index} >
              <Image
                source={index === 0 ? this.state.profilePic1.uri
                  && this.state.avatarSource1 : index === 1 ? this.state.profilePic2.uri
                    && this.state.avatarSource2 : index === 2 ? this.state.profilePic3.uri
                      && this.state.avatarSource3 : ''
                }

                style={{
                  width: 100,
                  height: 100,
                  alignItems: 'center',

                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
              />
            </View>
          </TouchableOpacity>

        )
      })

    }
  }
  onImageAdd = () => {
    let temp = index++;
    var added = [];
    added = this.state.valueArray.push({
      "id": temp
    });
    if(temp<1){
      this.setState({ imageSection: true, valueArray: this.state.valueArray }, () => {
        this.renderBottomComponent()
      })
    }else{
      this.setState({ imageSection: true, valueArray: this.state.valueArray,isDisable:true }, () => {
        this.renderBottomComponent()
      })
    }
    
  }



    _renderProperty = (id, index) => {
      var selectedValue = '';
      var labelName = '';
      var filterPropertyTitle = this.state.categoryDetails.filter(e => e.id === id);
      if (filterPropertyTitle && filterPropertyTitle.length > 0) {
        return filterPropertyTitle[0].catproperty.map(e => {
          if (e.title === 'Weight') {
            selectedValue = this.state.categoryWeightId;
            weightType = filterPropertyTitle[0].catproperty[0].Type;
            weightId = filterPropertyTitle[0].catproperty[0].Type === "Dropdown List" ? filterPropertyTitle[0].catproperty[0].id : ''
          }
  
          if (e.title === 'Attempt') {
            selectedValue = this.state.categoryAttemptId;
            attemptType = filterPropertyTitle[0].catproperty[1] ? filterPropertyTitle[0].catproperty[1].Type : '';
            attemptId = filterPropertyTitle[0].catproperty[1].Type === "Dropdown List" ? filterPropertyTitle[0].catproperty[1].id : 'True';
          }
          if (e.title === 'Count') {
            selectedValue = this.state.categoryCountId;
            countType = filterPropertyTitle[0].catproperty[2] ? filterPropertyTitle[0].catproperty[2].Type : '';
  
            countId = filterPropertyTitle[0].catproperty[2].Type === "Dropdown List" ? filterPropertyTitle[0].catproperty[2].id : 'True';
          }
          if (e.title === 'Manufacture') {
            selectedValue = this.state.categoryManufactureId;
            manufactureType = filterPropertyTitle[0].catproperty[3] ? filterPropertyTitle[0].catproperty[3].Type : '';
  
            manufactureId = filterPropertyTitle[0].catproperty[3].Type === "Dropdown List" ? filterPropertyTitle[0].catproperty[3].id : 'True';
          }
          if (e.title === 'Not used') {
            selectedValue = this.state.categoryNotUsedId;
            notUsedType = filterPropertyTitle[0].catproperty[4] ? filterPropertyTitle[0].catproperty[4].Type : '';
            notUsedId = filterPropertyTitle[0].catproperty[4].Type === "Dropdown List" ? filterPropertyTitle[0].catproperty[4].id : 'True';
          }
          if (e.title === 'Style') {
            selectedValue = this.state.categoryStyleId;
          }
        return (
          <>
            <Text style={AddProductStyle.textCategoryProperty}>{e.title} *</Text>
            {e.Type === "Dropdown List" || e.Type === "Boolean" ? (
              <View style={AddProductStyle.pickerCategoryView}>
                <Picker
                  selectedValue={selectedValue}
                  style={AddProductStyle.pickerStyle}
                  mode="dropdown"
                  onValueChange={(itemValue, selectValue) => {
                    setTimeout(() => {
                      this.updatePickerPropItem(itemValue, e.title);
                    }, 0);
                  }}>
                  <Picker.Item
                    color={Colors.placeholderColor}
                    label={'Choose From List'}
                    value={0}
                  />
                  {this._renderPickerPropValue(e)}
                </Picker>
              </View>) : (
                <TextInput
                  style={AddProductStyle.pickerTextInputView}
                  placeholderTextColor={Colors.placeholderColor}
                  onChangeText={(text) => this.setState({ firstName: text })}
                  onSubmitEditing={() => this.lastName.focus()}
                  defaultValue={this.state.firstName}
                />
              )
            }
          </>
        )
      })
    }
  }
  _renderPickerPropValue = (item) => {
    if (item && item != null) {
    }
    var booleanValues = [{
      id: "1",
      bolValue: 'True'
    },
    {
      id: "2",
      bolValue: 'False'
    }
    ]
    if (item && item != null && item.Type === "Dropdown List") {
      return item.propvalues.map(value => (
        <Picker.Item label={value.title} value={value.value} key={value.value} />
      ))
    } else if (item && item != null && item.Type === "Boolean" && booleanValues && booleanValues.length > 0) {
      return booleanValues.map(bool => (
        <Picker.Item label={bool.bolValue} value={bool.id} key={bool.id} />
      ))
    }

  }
  _renderSubCategoryPropValue = (item) => {
    var subBooleanValues = [{
      id: "1",
      bolValue: 'True'
    },
    {
      id: "2",
      bolValue: 'False'
    }
    ]
    if (item && item != null && item.Type === "Dropdown List") {
      return item.propvalues.map(value => (
        <Picker.Item label={value.title} value={value.value} key={value.value} />
      ))
    } else if (item && item != null && item.Type === "Boolean" && subBooleanValues && subBooleanValues.length > 0) {
      return subBooleanValues.map(bool => (
        <Picker.Item label={bool.bolValue} value={bool.id} key={bool.id} />
      ))
    }

  }
  updatePickerPropItem = (id, type) => {
    if (type == "Weight") {
      this.setState({
        categoryWeightId: id
      });
    } else if (type == "Attempt") {
      this.setState({
        categoryAttemptId: id
      })
    } else if (type == "Count") {
      this.setState({
        categoryCountId: id
      })
    } else if (type == "Manufacture") {
      this.setState({
        categoryManufactureId: id
      })
    } else if (type === "Not used") {
      this.setState({
        categoryNotUsedId: id
      })
    } else {
      this.setState({
        categoryWeightId: '',
        categoryAttemptId: '',
        categoryCountId: '',
        categoryManufactureId: '',
        categoryNotUsedId: '',
      })

    }

  }
  _renderSubCategory = () => {
    if (
      this.state.subCategoryDetail != null &&
      this.state.subCategoryDetail.length > 0
    ) {
      return this.state.subCategoryDetail.map(item => (
        <Picker.Item label={item.title} value={item.id} key={item.id} />
      ));
    }
  }
  updateSubCategory = (id) => {
    this.setState({
      subCategoryId: id
    }, () => {
      this._renderSubCategoryProp(this.state.subCategoryId)
    })
  }
  updateSubPropItem = (id, type) => {
    if (type == "Weight") {
      this.setState({
        subWeightId: id
      });
    } else if (type == "Attempt") {
      this.setState({
        subAttemptId: id
      })
    } else if (type == "Count") {
      this.setState({
        subCoinId: id
      })
    } else if (type == "Manufacture") {
      this.setState({
        subManufactureId: id
      })
    } else if (type === "Not used") {
      this.setState({
        subNotUsedId: id
      })
    } else {
      this.setState({
        subWeightId: '',
        subAttemptId: '',
        subCoinId: '',
        subManufactureId: '',
        subNotUsedId: '',
      })

    }
  }
  _renderSubCategoryProp = (id) => {
    var filterSubCategory = this.state.subCategoryDetail.filter(e => e.id === id)
    var selectedSubValue = '';
    if (filterSubCategory && filterSubCategory.length > 0 && filterSubCategory[0]) {
      return filterSubCategory[0].subpropvalues.map(e => {
        if (e.title === 'Weight') {
          selectedSubValue = this.state.subWeightId;
          subWeightType = filterSubCategory[0].subpropvalues[0].Type;
          subWeightId = filterSubCategory[0].subpropvalues[0].Type === "Dropdown List" ? filterSubCategory[0].subpropvalues[0].id : 'True'
        }
        if (e.title === 'Attempt') {
          selectedSubValue = this.state.subAttemptId;
          subAttemptType = filterSubCategory[0].subpropvalues[1].Type;
          subAttemptId = filterSubCategory[0].subpropvalues[1].Type === "Dropdown List" ? filterSubCategory[0].subpropvalues[1].id : 'True'
        }
        if (e.title === 'Count') {
          selectedSubValue = this.state.subCoinId;
          subCountType = filterSubCategory[0].subpropvalues[2].Type;
          subCountId = filterSubCategory[0].subpropvalues[2].Type === "Dropdown List" ? filterSubCategory[0].subpropvalues[2].id : 'True'
        }
        if (e.title === 'Manufacture') {
          selectedSubValue = this.state.subManufactureId;
          subManufactureType = filterSubCategory[0].subpropvalues[3].Type;
          subManufactureId = filterSubCategory[0].subpropvalues[3].Type === "Dropdown List" ? filterSubCategory[0].subpropvalues[3].id : 'True'
        }
        if (e.title === 'Not used') {
          selectedSubValue = this.state.subNotUsedId;
          subNotUsedType = filterSubCategory[0].subpropvalues[3].Type;
          subNotUsedId = filterSubCategory[0].subpropvalues[3].Type === "Dropdown List" ? filterSubCategory[0].subpropvalues[3].id : 'True'
        }
        return (
          <>
            <Text style={AddProductStyle.textCategoryProperty}>{e.title} *</Text>
            {e.Type === "Dropdown List" || e.Type === "Boolean" ? (
              <View style={AddProductStyle.pickerCategoryView}>
                <Picker
                  selectedValue={selectedSubValue}
                  style={AddProductStyle.pickerStyle}
                  mode="dropdown"
                  onValueChange={(itemValue) => {
                    setTimeout(() => {
                      this.updateSubPropItem(itemValue, e.title);
                    }, 0);
                  }}>
                  <Picker.Item
                    color={Colors.placeholderColor}
                    label={'Choose From List'}
                    value={0}
                  />
                  {this._renderSubCategoryPropValue(e)}
                </Picker>
              </View>) : (
                <TextInput
                  style={AddProductStyle.pickerTextInputView}
                  placeholderTextColor={Colors.placeholderColor}
                  onChangeText={(text) => this.setState({ firstName: text })}
                  onSubmitEditing={() => this.lastName.focus()}
                  defaultValue={this.state.firstName}
                />
              )
            }
          </>
        )
      })
    }
  }
  _updateProductHandle = () => {
    this.setState({isPressed:true})
    if (this.state.accessKeyDetails.key && this.state.categoryId != '' && this.state.subCategoryId && this.state.productName && this.state.productDes && this.state.productPrice && this.state.productLocation) {
      var catPropId = {
        "weightId": weightId ? weightId : '0',
        "attemptId": attemptId ? attemptId : '0',
        "manufactureId": manufactureId ? manufactureId : '0',
        "countId": countId ? countId : '0',
        "notUsedId": notUsedId ? notUsedId : '0'
      }
      var catPropType = {
        "weightType": weightType ? weightType : null,
        "attemptType": attemptType ? attemptType : null,
        "manufactureType": manufactureType ? manufactureType : null,
        "countType": countType ? countType : null,
        "notUsedType": notUsedType ? notUsedType : null
      }
      var subPropId = {
        "subWeightId": subWeightId ? subWeightId : '0',
        "subAttemptId": subAttemptId ? subAttemptId : '0',
        "subManufactureId": subManufactureId ? subManufactureId : '0',
        "subCountId": subCountId ? subCountId : '0',
        "subNotUsedId": subNotUsedId ? subNotUsedId : '0'
      }
      var subPropType = {
        "subWeightType": subWeightType ? subWeightType : null,
        "subAttemptType": subAttemptType ? subAttemptType : null,
        "subManufactureType": subManufactureType ? subManufactureType : null,
        "subCountType": subCountType ? subCountType : null,
        "subNotUsedType": subNotUsedType ? subNotUsedType : null
      }
      var data = {
        'accesskey': this.state.accessKeyDetails.key,
        'prodcat': this.state.categoryId,
        'prodsubcat': this.state.subCategoryId,
        'prodname': this.state.productName,
        'proddesc': this.state.productDes,
        'prodprice': this.state.productPrice,
        'prodloc': this.state.productLocation,
        'catpropid': catPropId.weightId + ',' + catPropId.attemptId + ',' + catPropId.manufactureId + ',' + catPropId.countId + ',' + catPropId.notUsedId,
        'catpropval': this.state.categoryWeightId + ',' + this.state.categoryAttemptId + ',' + this.state.categoryCountId + ',' + this.state.categoryManufactureId + ',' + this.state.categoryNotUsedId,
        'catproptype': catPropType.weightType + ',' + catPropType.attemptType + catPropType.manufactureType + ',' + catPropType.countType + ',' + catPropType.notUsedType,
        'subcatpropid': subPropId.subWeightId + ',' + subPropId.subAttemptId + ',' + subPropId.subManufactureId + ',' + subPropId.subCountId + ',' + subPropId.subNotUsedId,
        'subcatpropval': this.state.subWeightId + ',' + this.state.subAttemptId + ',' + this.state.subCoinId + ',' + this.state.subManufactureId + ',' + this.state.subNotUsedId,
        'subcatproptype': subPropType.subWeightType + ',' + subPropType.subAttemptType + ',' + subPropType.subManufactureType + ',' + subPropType.subCountType + ',' + subPropType.subNotUsedType
      }      
      let updateProductData = HttpHelper(UpdateProductUrl
        + 'accesskey' + '=' + data.accesskey + '&' +
        'prodcat' + '=' + data.prodcat + '&' + 'prodsubcat' + '=' +
        data.prodsubcat + '&' + 'prodname' + '=' + data.prodname + '&' + 'proddesc' + '=' + data.proddesc +
        '&' + 'prodprice' + '=' + data.prodprice + '&' + 'prodloc' + '=' + data.prodloc + '&' + 'catpropid' + '=' +
        data.catpropid + '&' + 'catpropval' + '=' + data.catpropval + '&' +
        'catproptype' + '=' + data.catproptype + '&' + 'subcatpropid' + '=' + data.subcatpropid +
        '&' + 'subcatpropval' + '=' + data.subcatpropval + '&' + 'subcatproptype' + '=' + data.subcatproptype, 'POST');
        updateProductData.then(response => {
        this.setState({isPressed:true})
        if (response != null) {
          this.setState({
            updateProductData: response,
            updateProductData: response.id,
            isPressed:false
          }, () => {
            if (this.state.isImageUpload) {
              if (fileData1 && response.id) {
                let imageUpload = HttpMultiPartHelper(
                  UpdateImageUrl +
                  'accesskey' +
                  '=' +
                  this.state.accessKeyDetails.key +
                  '&' +
                  'prodid' +
                  '=' +
                  response.id,
                  'POST',
                  fileData1,
                );
                imageUpload.then(imageResponse1 => {
                  this.setState({ isLoading: true,isPressed:true });
                  if (imageResponse1 && imageResponse1.status === 'true') {
                    this.setState({ isImageSave: true, isLoading: false,isPressed:false });
                  } else {
                    this.setState({ isImageSave: false, isLoading: false,isPressed:false });
                  }
                });
              }
              if (fileData2 && response.id) {
                let imageUpload = HttpMultiPartHelper(
                  AddProductImageUrl +
                  'accesskey' +
                  '=' +
                  this.state.accessKeyDetails.key +
                  '&' +
                  'prodid' +
                  '=' +
                  response.id,
                  'POST',
                  fileData2,
                );
                imageUpload.then(imageResponse2 => {
                  this.setState({ isLoading: true,isPressed:true });
                  if (imageResponse2 && imageResponse2.status === 'true') {
                    this.setState({ isImageSave: true, isLoading: false,isPressed:false });
                  } else {
                    this.setState({ isImageSave: false, isLoading: false,isPressed:false });
                  }
                });
              }
              if (fileData3 && response.id) {
                let imageUpload = HttpMultiPartHelper(
                  AddProductImageUrl +
                  'accesskey' +
                  '=' +
                  this.state.accessKeyDetails.key +
                  '&' +
                  'prodid' +
                  '=' +
                  response.id,
                  'POST',
                  fileData3,
                );
                imageUpload.then(imageResponse3 => {
                  this.setState({ isLoading: true,isPressed:true });
                  if (imageResponse3 && imageResponse3.status === 'true') {
                    this.setState({ isImageSave: true, isLoading: false,isPressed:false });
                  } else {
                    this.setState({ isImageSave: false, isLoading: false,isPressed:false });
                  }
                });
              }
              Alert.alert(
                '',
                response.message,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      
                    },
                  },
                ],
                { cancelable: false },
              );
            }
          })

        } else {
          this.setState({ updateProductData: [],isPressed:false })
        }
      })
    } else {
      this.dropdown.alertWithType('error', 'Error!', 'Please Enter All Fields');
      this.setState({ isPressed:false })

    }
  }
  selectImage = type => {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        if (type === 0) {
          this.setState({ profilePic1: { uri: response.uri, name: response.fileName, type: response.type, }, });
          const source = { uri: response.uri };
          this.setState({ avatarSource1: source, file: response, isImageUpload: true, }, () => {
            fileData1 = new FormData();
            fileData1.append('productimg', {
              uri: this.state.file.uri,
              name: this.state.file.fileName,
              type: this.state.file.type,
            });
          });
        }
        if (type === 1) {
          this.setState({ profilePic2: { uri: response.uri, name: response.fileName, type: response.type, }, });
          const source = { uri: response.uri };
          this.setState({ avatarSource2: source, file: response, isImageUpload: true, }, () => {
            fileData2 = new FormData();
            fileData2.append('productimg', {
              uri: this.state.file.uri,
              name: this.state.file.fileName,
              type: this.state.file.type,
            });
          });
        }
        if (type === 3) {
          this.setState({ profilePic3: { uri: response.uri, name: response.fileName, type: response.type, }, });
          const source = { uri: response.uri };
          this.setState({ avatarSource3: source, file: response, isImageUpload: true, }, () => {
            fileData3 = new FormData();
            fileData3.append('productimg', {
              uri: this.state.file.uri,
              name: this.state.file.fileName,
              type: this.state.file.type,
            });
          });
        }
      }
    });
  };
  render() {
    return (
      <>
        <StatusBar
          backgroundColor={Colors.mainBackground}
          barStyle="light-content"
        />
        <SafeAreaView backgroundColor={Colors.mainBackground} style={AppStyle.barStyle}>
          {/* <SecondaryHeader
          navigation={navigation}
          title={'New Product'}
          isLoggedin={false}
          isMyProduct={false}
        /> */}
          <ScrollView
            style={{
              backgroundColor: Colors.lightWhiteColor,
              height: height - 150,
            }}
            contentInsetAdjustmentBehavior="automatic">
            <View style={{ padding: 30 }}>
              <View style={AddProductStyle.categoryView}>
                <Text style={AddProductStyle.textProperty}>Category</Text>
                <View style={AddProductStyle.pickerView}>
                  <Picker
                    selectedValue={this.state.categoryId}
                    style={AddProductStyle.pickerStyle}
                    mode="dropdown"
                    onValueChange={(itemValue) => {
                      setTimeout(() => {
                        this.updatePickerItem(itemValue);
                      }, 0);
                    }}>
                    <Picker.Item
                      color={Colors.placeholderColor}
                      label={'Choose From List'}
                      value={0}
                    />
                    {this._renderPickerItem()}
                  </Picker>
                </View>
              </View>
              {this.state.categoryDetails && this.state.categoryId >= 1 && (
                <>
                  <View style={AddProductStyle.categoryPropertyView}>
                    {this._renderProperty(this.state.categoryId)}
                  </View>
                </>
              )}
              <View style={AddProductStyle.categoryView}>
                <Text style={AddProductStyle.textProperty}>Sub Category</Text>
                <View style={AddProductStyle.pickerView}>
                  <Picker
                    selectedValue={this.state.subCategoryId}
                    style={AddProductStyle.pickerStyle}
                    mode="dropdown"

                    onValueChange={(itemValue) => {
                      setTimeout(() => {
                        this.updateSubCategory(itemValue);
                      }, 0);
                    }}>
                    <Picker.Item
                      color={Colors.placeholderColor}
                      label={'Choose From List'}
                      value={0}
                    />
                    {this._renderSubCategory()}
                  </Picker>
                </View>
              </View>
              {this.state.subCategoryDetail && this.state.subCategoryId >= 1 && (
                <>
                  <View style={AddProductStyle.categoryPropertyView}>
                    {this._renderSubCategoryProp(this.state.subCategoryId)}
                  </View>
                </>
              )}
              <View style={AddProductStyle.contentView}>
                <Text style={AddProductStyle.textProperty}>Product Name</Text>
                <TextInput
                  style={AddProductStyle.textInputView}
                  placeholderTextColor={Colors.placeholderColor}
                  onChangeText={(text) => this.setState({ productName: text })}
                  onSubmitEditing={() => this.lastName.focus()}
                  defaultValue={this.state.productName}
                />
              </View>
              <View style={AddProductStyle.contentView}>
                <Text style={AddProductStyle.textProperty}>Product Slug</Text>
                <TextInput
                  style={AddProductStyle.textInputView}
                  placeholderTextColor={Colors.placeholderColor}
                  onChangeText={(text) => this.setState({ productSlug: text })}
                  onSubmitEditing={() => this.lastName.focus()}
                  defaultValue={this.state.productSlug}
                />
              </View>
              <View style={AddProductStyle.contentView}>
                <Text style={AddProductStyle.textProperty}>Price</Text>
                <TextInput
                  style={AddProductStyle.textInputView}
                  placeholderTextColor={Colors.placeholderColor}
                  onChangeText={(text) => this.setState({ productPrice: text })}
                  onSubmitEditing={() => this.lastName.focus()}
                  defaultValue={this.state.productPrice}
                />
              </View>
              <View style={AddProductStyle.contentView}>
                <Text style={AddProductStyle.textProperty}>Location</Text>
                <TextInput
                  style={AddProductStyle.textInputView}
                  placeholderTextColor={Colors.placeholderColor}
                  onChangeText={(text) => this.setState({ productLocation: text })}
                  onSubmitEditing={() => this.lastName.focus()}
                  defaultValue={this.state.productLocation}
                />
              </View>
              <View style={[AddProductStyle.contentView]}>
                <Text style={AddProductStyle.desText}>Description</Text>
                <TextInput
                  style={AddProductStyle.desInputView}
                  placeholderTextColor={Colors.placeholderColor}
                  onChangeText={(text) => this.setState({ productDes: text })}
                  onSubmitEditing={() => this.lastName.focus()}
                  defaultValue={this.state.productDes}
                  numberOfLines={4}
                  multiline={true}
                />
              </View>
            </View>
            <View>             
              <View style={[AddProductStyle.contentView,{paddingHorizontal:10}]}>
                {this.renderBottomComponent()}
                <TouchableOpacity
                disabled={this.state.isDisable}
                  onPress={() => this.onImageAdd()}
                  style={AddProductStyle.selectImageView}>
                  <MaterialIcons
                    name="add-circle-outline"
                    size={40}
                    color={Colors.placeholderColor}
                  />
                </TouchableOpacity>

               
              </View>
              <View style={{ paddingBottom: 20 }}></View>
              <TouchableOpacity
                onPress={() => {
                  this._updateProductHandle()
                }}
                style={AppStyle.applyAddButton}>
                  {this.state.isPressed ? (
                  <ActivityIndicator size="large" color={Colors.mainBackground} />
                ) : (
                <Text style={AppStyle.buttonText}>Update</Text>)}
              </TouchableOpacity>
            </View>
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

export default UpdateProduct;
