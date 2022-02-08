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
  Picker, ActivityIndicator, Alert, KeyboardAvoidingView, LogBox, Modal
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
import { AddProductsDetailsUrl, AddProductImageUrl, AddProductPropertyUrl, MyProductsUrl, UpdateProductUrl, updateProductImageUploadUrl, AllProductImagesUrl, DeleteImageUrl } from '../../HelperApi/Api/APIConfig';
import { HttpHelper, HttpMultiPartHelper, HttpAuthHelper } from '../../HelperApi/Api/HTTPHelper';
import DropdownAlert from 'react-native-dropdownalert';
import PickerComponent from '../../components/PickerComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';

var fileData1 = [];
var fileData2 = [];
var fileData3 = [];
var fileData4 = [];
var fileData5 = [];
var fileData6 = [];
var fileData7 = [];
var fileData8 = [];

var file1 = [];
var file2 = [];
var file3 = [];
var file4 = [];
var file5 = [];
var file6 = [];
var file7 = [];
var file8 = [];
var fileList = [];
var SubTest = '';
var SubValue = '';
var deleteArray = [];
var filterSubCategory = [];
var filterPropertyTitle = [];
var nameCAtegory = [];
var selectedCatId = [];
var selectedSubId = [];
var nameSubCAtegory = [];
var selectedSubTitleId = [];
var subTitle = "";
var subType = "";
var catType = "";
var catTitle = "";
var selectedCatTypeId = []
var selectedSubTypeId = [];
var renderSubType = "";
var selectedCatTitleId = [];
var fileDataList = [];
var selectedCategoryValue = ''
const { width, height } = Dimensions.get('screen');
var idValue = ''
const options = {
  title: 'Select Avatar',
  // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
var index = 1;
var isUpdateProps = false;
class AddProduct extends Component {
  constructor(props) {
    super(props);
    var params = this.props.route.params;
    this.state = {
      firstName: '',
      categoryId: params && params.isUpdate ? params.getProductDetails ? params.getProductDetails.category[0].catid : '' : '',
      profilePic: '',
      avatarSource1: params && params.isUpdate ? params.getProductDetails ? params.getProductDetails.image : '' : '',
      isImagePressed: false,
      profilePic: '',
      file: '',
      accessKeyDetails: {},
      isImageUpload: params && params.isUpdate ? params.getProductDetails && params.getProductDetails.image ? true : false : false,
      isLoading: false,
      categoryDetails: [],
      subCategoryDetail: [],
      subCategoryId: params && params.isUpdate ? params.getProductDetails ? params.getProductDetails.subcategory[0].catid : '' : '',
      productAddDetails: [],
      productId: params && params.isUpdate ? params.getProductDetails ? params.getProductDetails.id : '' : '',
      productName: params && params.isUpdate ? params.getProductDetails ? params.getProductDetails.title : '' : '',
      productSlug: params && params.isUpdate ? params.getProductDetails ? params.getProductDetails.title : '' : '',
      productDes: params && params.isUpdate ? params.getProductDetails ? params.getProductDetails.description : '' : '',
      productPrice: params && params.isUpdate ? params.getProductDetails ? params.getProductDetails.price : '' : '',
      productLocation: params && params.isUpdate ? params.getProductDetails ? params.getProductDetails.location : '' : '',
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
      subWeightId: '',
      subAttemptId: '',
      subManufactureId: '',
      subCoinId: '',
      isDisable: false,
      isPressed: false,
      propWeight: '',
      propAttempt: '',
      propManufacture: '',
      propCount: '',
      propNotUsed: '',
      selectedDropDownValue: 0,
      subCategroyText: '',
      isAdd: params && params.isAdd ? params.isAdd : false,
      updateCategoryDetails: params && params.isUpdate ? params.getProductDetails ? params.getProductDetails.category : [] : [],
      updateSubCategoryDetails: params && params.isUpdate ? params.getProductDetails ? params.getProductDetails.subcategory : [] : [],
      isUpdate: params && params.isUpdate ? params.isUpdate : false,
      isOldImage: false,
      imageId1: '',
      imageId2: '',
      imageId3: '',
      activeProducts: [],
      isUpdateData: false
    }
  }

  getDetails = () => {
    AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
      if (accessKeyDetails != null) {
        this.setState({
          accessKeyDetails: JSON.parse(accessKeyDetails),
          isLoading: true,
        }, () => {
          if (this.state.productId) {
            let AllproductDetails = HttpHelper(
              MyProductsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
            AllproductDetails.then((response) => {
              if (response.status === 'true') {
                this.setState({
                  activeProducts: response.Active,
                }, () => {
                  if (this.state.activeProducts && this.state.productId) {
                    selectedSubId = []
                    selectedCatId = []
                    var updatePro = this.state.activeProducts.filter(e => e.id === this.state.productId)
                    if (updatePro && updatePro[0].subcategory[0].catpropval) {
                      isUpdateProps = true;
                      updatePro[0].subcategory[0].catpropval.map(e => {
                        if (e.proptype === "Boolean") {
                          selectedSubId.push({
                            "id": e.propvalid,
                            "title": e.propname
                          })
                        }
                        if (e.proptype === 'Dropdown List') {
                          selectedSubId.push({
                            "id": e.propvalid,
                            "title": e.propval
                          })
                        }
                        if (e.proptype === 'Text') {
                          selectedSubId.push({
                            "id": e.propval,
                            "title": e.propval
                          })
                        }
                      })
                    }
                    if (updatePro && updatePro[0].category[0].catpropval) {
                      selectedCatId = [];
                      isUpdateProps = true;
                      updatePro[0].category[0].catpropval.map(e => {
                        if (e.proptype === "Boolean") {
                          selectedCatId.push({
                            "id": e.propval,
                            "title": e.propname
                          })
                        }
                        if (e.proptype === 'Dropdown List') {
                          selectedCatId.push({
                            "id": e.propvalid,
                            "title": e.propval
                          })
                        }
                        if (e.proptype === 'Text') {
                          selectedCatId.push({
                            "id": e.propval,
                            "title": e.propname,
                          })
                        }
                      })
                    }
                  }
                })
              } else {
                this.setState({
                  activeProducts: [],
                  isLoading: false
                })
              }
            });
          } else {
            this.setState({
              isLoading: false
            })
          }
          let productDetails = HttpHelper(
            AddProductsDetailsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
          productDetails.then((response) => {
            if (response.status === 'true') {
              this.setState({
                categoryDetails: response.Category,
                isLoading: false
              }, () => {
                if (this.state.categoryDetails && this.state.categoryDetails.length > 0 && this.state.categoryId && this.state.subCategoryId) {
                  var selectedCategory = this.state.categoryDetails.filter(e => e.id === this.state.categoryId);
                  if (selectedCategory && selectedCategory[0]) {
                    selectedCategory[0].catproperty.map(e => {
                      var categoryFirst = selectedCatTitleId.findIndex(val => val.id === e.id)
                      if (categoryFirst != -1) {
                        selectedCatTitleId[categoryFirst].id = e.id
                      } else {
                        selectedCatTitleId.push({
                          "id": e.id,
                        })
                      }
                      var catTitleNameDrop = selectedCatTypeId.findIndex(val => val.textId === e.id)
                      if (catTitleNameDrop != -1) {
                        selectedCatTypeId[catTitleNameDrop].id = e.Type
                        selectedCatTypeId[catTitleNameDrop].textId = e.id
                      } else {
                        selectedCatTypeId.push({
                          "id": e.Type,
                          "textId": e.id
                        })
                      }
                    })
                    this.setState({
                      categoryId: this.state.categoryId,
                      subCategoryDetail: (selectedCategory && selectedCategory[0]) ? selectedCategory[0].subcat : [],
                      selectedTitle: (selectedCategory && selectedCategory[0]) ? selectedCategory[0].title : '',
                      subCategoryId: this.state.subCategoryId,
                    }, () => {
                      this._renderProperty(this.state.categoryId, this.state.isUpdateData)
                    });
                    if (this.state.subCategoryDetail && this.state.subCategoryDetail.length > 0) {
                      this._renderSubCategoryProp(this.state.subCategoryId)
                    }
                  }
                  var selectedSubCategory = this.state.categoryDetails.filter(e => e.id === this.state.categoryId);
                }
                if (selectedSubCategory && selectedSubCategory.length > 0) {
                  var selectSubTitle = selectedSubCategory[0].subcat.filter(e => e.id === this.state.subCategoryId)
                }
                if (selectSubTitle && selectSubTitle.length > 0) {
                  selectSubTitle[0].subpropvalues.map((item, i) => {
                    var subHeadId = selectedSubTitleId.findIndex((val, index) => index === i)
                    if (subHeadId != -1) {
                      selectedSubTitleId[subHeadId].id = item.id
                      selectedSubTitleId[subHeadId].title = item.title
                      selectedSubTitleId[subHeadId].type = item.Type
                    }
                    else {
                      selectedSubTitleId.push({
                        "id": item.id,
                        "title": item.title,
                        "type": item.Type,
                      })
                    }
                    var subTitleNameDrop = selectedSubTypeId.findIndex(val => val.textId === item.id)
                    if (subTitleNameDrop != -1) {
                      selectedSubTypeId[subTitleNameDrop].id = item.Type
                      selectedSubTypeId[subTitleNameDrop].textId = item.id
                    } else {
                      selectedSubTypeId.push({
                        "id": item.Type,
                        "textId": item.id,
                      })
                    }
                  })
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
      this._gettingAllImage()
    });
  }
  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      fileDataList = [];
      fileList = [];
      this.getDetails();
    })
  }
  componentWillReceiveProps(nextProps) {
  }
  _gettingAllImage = () => {
    let AllImageUpload = HttpHelper(
      AllProductImagesUrl +
      'accesskey' +
      '=' +
      this.state.accessKeyDetails.key +
      '&' +
      'prodid' +
      '=' +
      this.state.productId,
      'POST',
    );
    AllImageUpload.then(AllImageResponse => {
      if (AllImageResponse) {
        if (
          AllImageResponse.prodimages && AllImageResponse.prodimages[0] &&
          AllImageResponse.prodimages[0].imageid
        ) {
          index = 1;
          this.state.valueArray.push({
            'imagePath': AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[0].image : '',
            "icon": <AntDesign
              name="closecircle"
              style={{
                textAlign: 'right'
              }}
              size={18}
              color={Colors.textColor}
            />
          })
          file1 = new FormData();
          file1.append('productimg', {
            uri: AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[0].imgurl : '',
          });
          fileList.push({
            "fileData": file1,
            "imageId": AllImageResponse.prodimages[0].imageid,
            "imagePath": AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[0].image : ''
          })
          this.setState({
            imagePath1: AllImageResponse.prodimages[0].image,
            imageId1: AllImageResponse.prodimages[0].imageid,
            isOldImage: true,
          }, () => { this.onImageAdd("isUpdate") });

        }
        if (
          AllImageResponse.prodimages &&AllImageResponse.prodimages[1] &&
          AllImageResponse.prodimages[1].imageid
        ) {
          index = 2;
          this.state.valueArray.push({
            'imagePath': AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[1].image : '',
            "icon": <AntDesign
              name="closecircle"
              style={{
                textAlign: 'right'
              }}
              size={18}
              color={Colors.textColor}
            />
          })
          file2 = new FormData();
          file2.append('productimg', {
            uri: AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[1].imgurl : '',
          });
          fileList.push({
            "fileData": file2,
            "imageId": AllImageResponse.prodimages[1].imageid,
            "imagePath": AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[1].image : ''


          })
          this.setState({
            imagePath2: AllImageResponse.prodimages[1].image,
            imageId2: AllImageResponse.prodimages[1].imageid,
            isOldImage: true,
          }, () => { this.onImageAdd('isUpdate') });
        }
        if (
          AllImageResponse.prodimages &&AllImageResponse.prodimages[2] &&
          AllImageResponse.prodimages[2].imageid
        ) {
          index = 3;
          this.state.valueArray.push({
            'imagePath': AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[2].image : '',
            "icon": <AntDesign
              name="closecircle"
              style={{
                textAlign: 'right'
              }}
              size={18}
              color={Colors.textColor}
            />
          })
          file3 = new FormData();
          file3.append('productimg', {
            uri: AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[2].imgurl : '',
          });
          fileList.push({
            "fileData": file3,
            "imageId": AllImageResponse.prodimages[2].imageid,
            "imagePath": AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[2].image : ''


          })
          this.setState({
            imagePath3: AllImageResponse.prodimages[2].image,
            imageId3: AllImageResponse.prodimages[2].imageid,
            isOldImage: true,
          }, () => {
            this.onImageAdd('isUpdate')
          });
        }
        if (
          AllImageResponse.prodimages &&AllImageResponse.prodimages[3] &&
          AllImageResponse.prodimages[3].imageid
        ) {
          index = 4;
          this.state.valueArray.push({
            'imagePath': AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[3].image : '',
            "icon": <AntDesign
              name="closecircle"
              style={{
                textAlign: 'right'
              }}
              size={18}
              color={Colors.textColor}
            />
          })
          file4 = new FormData();
          file4.append('productimg', {
            uri: AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[3].imgurl : '',
          });
          fileList.push({
            "fileData": file4,
            "imageId": AllImageResponse.prodimages[3].imageid,
            "imagePath": AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[3].image : ''


          })
          this.setState({
            imagePath4: AllImageResponse.prodimages[3].image,
            imageId4: AllImageResponse.prodimages[3].imageid,
            isOldImage: true,
          }, () => {
            this.onImageAdd('isUpdate')
          });
        }
        if (
          AllImageResponse.prodimages &&AllImageResponse.prodimages[4] &&
          AllImageResponse.prodimages[4].imageid
        ) {
          index = 5;
          this.state.valueArray.push({
            'imagePath': AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[4].image : '',
            "icon": <AntDesign
              name="closecircle"
              style={{
                textAlign: 'right'
              }}
              size={18}
              color={Colors.textColor}
            />
          })
          file5 = new FormData();
          file5.append('productimg', {
            uri: AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[4].imgurl : '',
          });
          fileList.push({
            "fileData": file5,
            "imageId": AllImageResponse.prodimages[4].imageid,
            "imagePath": AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[4].image : ''


          })
          this.setState({
            imagePath5: AllImageResponse.prodimages[4].image,
            imageId5: AllImageResponse.prodimages[4].imageid,
            isOldImage: true,
          }, () => {
            this.onImageAdd('isUpdate')
          });
        }
        if (
          AllImageResponse.prodimages &&AllImageResponse.prodimages[5] &&
          AllImageResponse.prodimages[5].imageid
        ) {
          index = 6;
          this.state.valueArray.push({
            'imagePath': AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[5].image : '',
            "icon": <AntDesign
              name="closecircle"
              style={{
                textAlign: 'right'
              }}
              size={18}
              color={Colors.textColor}
            />
          })
          file6 = new FormData();
          file6.append('productimg', {
            uri: AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[5].imgurl : '',
          });
          fileList.push({
            "fileData": file6,
            "imageId": AllImageResponse.prodimages[5].imageid,
            "imagePath": AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[5].image : ''


          })
          this.setState({
            imagePath6: AllImageResponse.prodimages[5].image,
            imageId6: AllImageResponse.prodimages[5].imageid,
            isOldImage: true,
          }, () => {
            this.onImageAdd('isUpdate')
          });
        }
        if (
          AllImageResponse.prodimages &&AllImageResponse.prodimages[6] &&
          AllImageResponse.prodimages[6].imageid
        ) {
          index = 7;
          this.state.valueArray.push({
            'imagePath': AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[6].image : '',
            "icon": <AntDesign
              name="closecircle"
              style={{
                textAlign: 'right'
              }}
              size={18}
              color={Colors.textColor}
            />
          })
          file7 = new FormData();
          file7.append('productimg', {
            uri: AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[6].imgurl : '',
          });
          fileList.push({
            "fileData": file7,
            "imageId": AllImageResponse.prodimages[6].imageid,
            "imagePath": AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[6].image : ''


          })
          this.setState({
            imagePath7: AllImageResponse.prodimages[6].image,
            imageId7: AllImageResponse.prodimages[6].imageid,
            isOldImage: true,
          }, () => {
            this.onImageAdd('isUpdate')
          });
        }
        if (
          AllImageResponse.prodimages &&AllImageResponse.prodimages[7] &&
          AllImageResponse.prodimages[7].imageid
        ) {
          index = 8;
          this.state.valueArray.push({
            'imagePath': AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[7].image : '',
            "icon": <AntDesign
              name="closecircle"
              style={{
                textAlign: 'right'
              }}
              size={18}
              color={Colors.textColor}
            />
          })
          file8 = new FormData();
          file8.append('productimg', {
            uri: AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[7].imgurl : '',
          });
          fileList.push({
            "fileData": file8,
            "imageId": AllImageResponse.prodimages[7].imageid,
            "imagePath": AllImageResponse && AllImageResponse.prodimages ? AllImageResponse.prodimages[7].image : ''


          })
          this.setState({
            imagePath8: AllImageResponse.prodimages[7].image,
            imageId8: AllImageResponse.prodimages[7].imageid,
            isOldImage: true,
          }, () => {
            this.onImageAdd('isUpdate')
          });
        }
      }
    });
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
    selectedCatTitleId = [];
    selectedCatTypeId = [];
    selectedCatId = [];
    selectedSubId = [];
    selectedSubTitleId = [];
    selectedSubTypeId = [];
    isUpdateProps = false;
    if (this.state.categoryDetails && this.state.categoryDetails.length > 0) {
      var selectedCategory = this.state.categoryDetails.filter(e => e.id === id);
      if (selectedCategory && selectedCategory.length > 0) {
        selectedCategory[0].catproperty.map(e => {
          var categoryFirst = selectedCatTitleId.findIndex(val => val.id === e.id)
          if (categoryFirst != -1) {
            selectedCatTitleId[categoryFirst].id = e.id
          } else {
            selectedCatTitleId.push({
              "id": e.id,
            })
          }
          var catTitleNameDrop = selectedCatTypeId.findIndex(val => val.textId === e.id)
          if (catTitleNameDrop != -1) {
            selectedCatTypeId[catTitleNameDrop].id = e.Type
            selectedCatTypeId[catTitleNameDrop].textId = e.id
          } else {
            selectedCatTypeId.push({
              "id": e.Type,
              "textId": e.id
            })
          }
        })
      }
    }
    this.setState({
      categoryId: id,
      subCategoryDetail: (selectedCategory && selectedCategory[0]) ? selectedCategory[0].subcat : [],
      selectedTitle: (selectedCategory && selectedCategory[0]) ? selectedCategory[0].title : '',
      updateCategoryDetails: [],
      isUpdateData: true,
    }, () => {
      this._renderProperty(this.state.categoryId, true)
    });
  };

  closeModal = (data) => {
    var array = [...this.state.valueArray]; // make a separate copy of the array
    var index = array.findIndex((val, index) => val.id === data.id)
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ valueArray: array });
    }
    var arrayFile = [...fileList]
    var arrayFileIndex = arrayFile.filter((val, index) => val.imagePath === data.imagePath)
    deleteArray = arrayFileIndex.filter(e => e.imagePath == data.imagePath)
    if (deleteArray) {
      if (this.state.accessKeyDetails) {
        deleteArray.map(datas => {
          let imageUpload = HttpHelper(
            DeleteImageUrl +
            'accesskey' +
            '=' +
            this.state.accessKeyDetails.key +
            '&' +
            'prodid' +
            '=' +
            this.state.productId +
            '&' +
            'imgid' +
            '=' +
            datas.imageId,
            'GET',
          );
          imageUpload.then(deleteResponse => {
            if (deleteResponse && deleteResponse.status === 'true') {
              // this._gettingAllImage()
              // this.setState({ isImageSave: true, isLoading: false, isPressed: false }, () => {
              //   Alert.alert(
              //     '',
              //     'Product Updated Successfully.After Admin Aproval your product will be displayed',
              //     [
              //       {
              //         text: 'OK',
              //         onPress: () => {
              //           this.props.navigation.push('MyProduct');
              //         },
              //       },
              //     ],
              //     { cancelable: false },
              //   );
              // });
            }
          })
        })
      }
    }
    if (arrayFileIndex !== -1) {
      arrayFile.splice(arrayFileIndex, 1);
      fileList = arrayFile
    }
  }
  _renderSectorItem = (item, index) => {
    return (
      <>
        {/* <TouchableOpacity  onPress={() => this.selectImage(index)}> */}
        <View key={index} style={{ flexDirection: 'row', paddingHorizontal: 5, paddingVertical: 10 }} >
          <FastImage
            style={{
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}
            source={{
              uri: item.imagePath ? item.imagePath : item.imagePath,
              headers: { Authorization: 'token' },
              priority: FastImage.priority.high
            }}
            resizeMode={FastImage.resizeMode.cover}
            // style={{ marginTop: 25 }}
            onLoadStart={() => { this.setState({ loading: true }) }}
            onLoadEnd={() => { this.setState({ loading: false }) }}
          >
            <ActivityIndicator size="small" color={Colors.mainBackground} animating={this.state.loading} />
          </FastImage>
          {
            <TouchableOpacity key={index}
              onPress={() => this.closeModal(item)}>
              <Text>{item.icon}</Text>
            </TouchableOpacity>
          }
        </View>
        {/* </TouchableOpacity> */}
      </>
    )
  }
  renderBottomComponent = () => {
    if (this.state.valueArray) {
      return (
        <>
          <FlatList
            numColumns={3}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item, index }) => this._renderSectorItem(item, index)}
            data={this.state.valueArray}
          />
        </>)
    }
  }
  onImageAdd = (type) => {
    let temp = index++;
    var added = [];
    this.renderBottomComponent()
    if (type != "isUpdate") {
      this.selectImage(temp)
    }
  }
  _renderProperty = (id, type) => {
    filterPropertyTitle = this.state.categoryDetails.filter(e => e.id === id);
    if (filterPropertyTitle && filterPropertyTitle.length > 0 && filterPropertyTitle[0].catproperty) {
      return filterPropertyTitle[0].catproperty.map((e, i) => {
        e.selectedValue = 0;
        return (
          <>
            <Text style={AddProductStyle.textCategoryProperty}>{e.title} *</Text>
            <PickerComponent
              onCatSelected={this.onCatSelected}
              keyValue={i}
              propValues={e}
              navigation={this.props.navigation}
              selectedValue={e.selectedValue}
              category={true}
              catLabelName={e.id}
              updateValues={this.state.isUpdate ? this.state.updateCategoryDetails : []}
              updateType={type}
              isUpdateProps={isUpdateProps}
            />
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
    selectedSubTitleId = [];
    selectedSubTypeId = [];
    this.setState({ isUpdateData: false })
    if (this.state.categoryDetails && this.state.categoryDetails.length > 0) {
      var selectedSubCategory = this.state.categoryDetails.filter(e => e.id === this.state.categoryId);
    }
    if (selectedSubCategory && selectedSubCategory.length > 0) {
      var selectSubTitle = selectedSubCategory[0].subcat.filter(e => e.id === id)
    }
    if (selectSubTitle && selectSubTitle.length > 0) {
      selectSubTitle[0].subpropvalues.map((item, i) => {
        var subHeadId = selectedSubTitleId.findIndex((val, index) => index === i)
        if (subHeadId != -1) {
          selectedSubTitleId[subHeadId].id = item.id
          selectedSubTitleId[subHeadId].title = item.title
          selectedSubTitleId[subHeadId].type = item.Type
        }
        else {
          selectedSubTitleId.push({
            "id": item.id,
            "title": item.title,
            "type": item.Type,
          })
        }
        var subTitleNameDrop = selectedSubTypeId.findIndex(val => val.textId === item.id)
        if (subTitleNameDrop != -1) {
          selectedSubTypeId[subTitleNameDrop].id = item.Type
          selectedSubTypeId[subTitleNameDrop].textId = item.id
        } else {
          selectedSubTypeId.push({
            "id": item.Type,
            "textId": item.id,
          })
        }
      })
    }
    this.setState({
      subCategoryId: id,
      selectedSubTitle: selectSubTitle && selectSubTitle[0] ? selectSubTitle[0].title : '',
      updateSubCategoryDetails: [],
    }, () => {
      this._renderSubCategoryProp(this.state.subCategoryId, true)
    })
  }
  onSelected = (value, item, filterValue, labelname) => {
    if (filterValue === "Dropdown List") {
      if (item && item != null && item.propvalues && item.propvalues.length > 0) {
        var filterValue = item.propvalues.filter((item, index) => index === value)
        if (filterValue && filterValue.length > 0) {
          var titleNameDrop = selectedSubId.findIndex(e => e.dropdownId === item.id)
          if (titleNameDrop != -1) {
            selectedSubId[titleNameDrop].id = filterValue[0].value
            selectedSubId[titleNameDrop].title = filterValue[0].title
          } else {
            selectedSubId.push({
              "id": filterValue[0].value,
              "title": filterValue[0].title,
              "dropdownId": item.id
            })
          }
        }
      }
      // }
    }
    if (filterValue === "Boolean") {
      if (item && item.length > 0) {
        var filterBolValue = item.filter((item) => {
          return item.id == value;
        })
        if (filterBolValue && filterBolValue.length > 0) {
          var subBoolDrop = selectedSubId.findIndex(e => e.id === value)
          if (subBoolDrop != -1) {
            selectedSubId[subBoolDrop].id = filterBolValue[0].bolValue
            selectedSubId[subBoolDrop].title = filterBolValue[0].id
          } else {
            selectedSubId.push({
              "id": filterBolValue[0].bolValue,
              "title": filterBolValue[0].id,
            })
          }
        }
      }
      // }
    }
    if (filterValue === "Text") {
      // if (this.state.productId) {
      //   if (filterSubCategory && filterSubCategory.length > 0 && filterSubCategory[0].subpropvalues) {
      //     var subCat = filterSubCategory[0].subpropvalues.filter((e, i) => (e.id === item))
      //     if (subCat && subCat.length > 0) {
      //       var titleNameSubCategory = selectedSubId.findIndex(e => e.title === subCat[0].title)
      //       if (titleNameSubCategory != -1) {
      //         selectedSubId[titleNameSubCategory].id = value
      //         selectedSubId[titleNameSubCategory].title = subCat[0].title
      //       }
      //     }
      //   }
      // } else {
      if (filterSubCategory && filterSubCategory.length > 0 && filterSubCategory[0].subpropvalues) {
        var subCat = filterSubCategory[0].subpropvalues.filter((e, i) => (e.id === item))
        if (subCat && subCat.length > 0) {
          var titleNameSubCategory = selectedSubId.findIndex(e => e.title === subCat[0].title)
          if (titleNameSubCategory != -1) {
            selectedSubId[titleNameSubCategory].id = value
            selectedSubId[titleNameSubCategory].title = subCat[0].title

          } else {
            selectedSubId.push({
              "id": value,
              "title": subCat[0].title
            })
          }
        }
      }
      // }
    }
  }
  onCatSelected = (value, item, type, catName) => {
    if (type === "DropDown List") {
      if (item && item != null && item.propvalues && item.propvalues.length > 0) {
        const filterCatValue = item.propvalues.filter(
          (detail, index) => {
            return index === value;
          }
        );
        var categoryDropDownDrop = selectedCatId.findIndex(e => e.id === filterCatValue[0].value)
        if (filterCatValue && filterCatValue.length > 0) {
          if (categoryDropDownDrop != -1) {
            selectedCatId[categoryDropDownDrop].id = filterCatValue[0].value
            selectedCatId[categoryDropDownDrop].title = filterCatValue[0].title
            selectedCatId[categoryDropDownDrop].type = type
          } else {
            if (isUpdateProps) {
              selectedCatId.shift({
                "id": filterCatValue[0].value,
                "title": filterCatValue[0].title,
                "type": type
              })

              selectedCatId.unshift({
                "id": filterCatValue[0].value,
                "title": filterCatValue[0].title,
                "type": type
              })
            } else {
              selectedCatId.push({
                "id": filterCatValue[0].value,
                "title": filterCatValue[0].title,
                "type": type
              })
            }
          }
        }
      }
      // }
    }
    if (type === "Boolean") {
      // if (value === 1) {
      //   value = 0
      // } else {
      //   value = 1
      // }
      if (item && item.length > 0) {
        var filterCatBolValue = item.filter((item, index) => index === value)
        if (filterCatBolValue && filterCatBolValue.length > 0) {
          var catBoolDrop = selectedCatId.findIndex(e => e.id === filterCatBolValue[0].id)
          if (catBoolDrop != -1) {
            selectedCatId[catBoolDrop].id = filterCatBolValue[0].bolValue
            selectedCatId[catBoolDrop].title = filterCatBolValue[0].id
          } else {
            selectedCatId.push({
              "id": filterCatBolValue[0].bolValue,
              "title": filterCatBolValue[0].id,
              // "dropdownId": item.id
            })
          }
        }
      }
      // }

    }
    if (type === "Text") {
      if (filterPropertyTitle && filterPropertyTitle.length > 0 && filterPropertyTitle[0].catproperty) {
        var cat = filterPropertyTitle[0].catproperty.filter((e, i) => e.id === item)
        if (cat && cat.length > 0) {
          var titleNameCategory = selectedCatId.findIndex(e => e.title === cat[0].title)
          if (titleNameCategory != -1) {
            selectedCatId[titleNameCategory].id = value
          } else {
            selectedCatId.push({
              "id": value,
              "title": cat[0].title
            })
          }
        }
      }
    }

  }
  _renderSubCategoryProp = (id, type) => {
    var selectedSubValue = '';
    filterSubCategory = this.state.subCategoryDetail.filter(e => e.id === id)
    if (filterSubCategory && filterSubCategory.length > 0 && filterSubCategory[0] && filterSubCategory[0].subpropvalues) {
      return filterSubCategory[0].subpropvalues.map((e, i) => {
        e.selectedValue = 0;
        return (
          <>
            <Text style={AddProductStyle.textCategoryProperty}>{e.title} *</Text>
            <PickerComponent
              onSelected={this.onSelected}
              keyValue={i}
              propValues={e}
              navigation={this.props.navigation}
              selectedValue={e.selectedValue}
              subCategory={true}
              subLabelName={e.id}
              updateSubValues={this.state.isUpdate ? this.state.updateSubCategoryDetails : []}
            />
          </>
        )
      })
    }
  }
  _addProductHandle = (status) => {
    this.setState({ isPressed: true })
    const newselectedSubTitleId = [];
    const newselectedCatTitleId = [];
    const newselectedCatTypeId = [];
    const newselectedSubTypeId = [];
    SubTest = "";
    SubValue = '';
    subType = '';
    catType = '';
    catTitle = '';
    subTitle = '';
    if (this.state.accessKeyDetails.key && this.state.categoryId != '' && this.state.subCategoryId && this.state.productName && this.state.productDes && this.state.productPrice && this.state.productLocation) {
      if (this.state.isImageUpload && this.state.valueArray && this.state.valueArray.length > 0) {
        if (selectedCatId && selectedCatId.length) {
          selectedCatId.map(e => {
            if (SubTest != "") {
              SubTest = SubTest + "," + e.id;
            } else {
              SubTest = e.id
            }
          })
        }
        if (selectedSubId && selectedSubId.length) {
          selectedSubId.map(e => {
            if (SubValue != "") {
              SubValue = SubValue + "," + e.id;
            } else {
              SubValue = e.id
            }
          })
        }
        if (selectedSubTypeId && selectedSubTypeId.length > 0) {
          selectedSubTypeId.map(e => {
            if (subType != "") {
              subType = subType + "," + e.id;
            } else {
              subType = e.id
            }
          })
        }
        if (selectedCatTypeId && selectedCatTypeId.length > 0) {
          selectedCatTypeId.map(e => {
            if (catType != "") {
              catType = catType + "," + e.id;
            } else {
              catType = e.id
            }
          })
        }
        if (selectedCatTitleId && selectedCatTitleId.length > 0) {
          selectedCatTitleId.map(e => {
            if (catTitle != "") {
              catTitle = catTitle + "," + e.id;
            } else {
              catTitle = e.id
            }
          })
        }
        if (selectedSubTitleId && selectedSubTitleId.length > 0) {
          selectedSubTitleId.forEach(obj => {
            if (!newselectedSubTitleId.some(o => o.id === obj.id)) {
              newselectedSubTitleId.push({ ...obj })
            }
          });
          newselectedSubTitleId.map(e => {
            if (subTitle != "") {
              subTitle = subTitle + "," + e.id;
            } else {
              subTitle = e.id
            }
          })
        }
        var data = {
          'accesskey': this.state.accessKeyDetails.key,
          'prodcat': this.state.categoryId,
          'prodsubcat': this.state.subCategoryId,
          'prodname': this.state.productName,
          'proddesc': this.state.productDes,
          'prodprice': this.state.productPrice,
          'prodloct': this.state.productLocation,
          'catpropid': catTitle,
          'catpropval': SubTest,
          'catproptype': catType,
          'subcatpropid': subTitle,
          'subcatpropval': SubValue,
          'subcatproptype': subType,
        }
        if (status === true) {
          let addProductData = HttpHelper(AddProductPropertyUrl
            + 'accesskey' + '=' + data.accesskey + '&' +
            'prodcat' + '=' + data.prodcat + '&' + 'prodsubcat' + '=' +
            data.prodsubcat + '&' + 'prodname' + '=' + data.prodname + '&' + 'proddesc' + '=' + data.proddesc +
            '&' + 'prodprice' + '=' + data.prodprice + '&' + 'prodloct' + '=' + data.prodloct + '&' + 'catpropid' + '=' +
            data.catpropid + '&' + 'catpropval' + '=' + data.catpropval + '&' +
            'catproptype' + '=' + data.catproptype + '&' + 'subcatpropid' + '=' + data.subcatpropid +
            '&' + 'subcatpropval' + '=' + data.subcatpropval + '&' + 'subcatproptype' + '=' + data.subcatproptype, 'POST');
          addProductData.then((addProductDataResponse) => {
            this.setState({ isPressed: true })
            if (addProductDataResponse != null) {
              this.setState({
                addProductData: addProductDataResponse,
                addProductId: addProductDataResponse.id,
                isPressed: true
              }, () => {
                if (this.state.isImageUpload) {
                  if (fileDataList && addProductDataResponse.id) {
                    fileDataList.map(img => {
                      let imageUpload = HttpMultiPartHelper(
                        AddProductImageUrl +
                        'accesskey' +
                        '=' +
                        this.state.accessKeyDetails.key +
                        '&' +
                        'prodid' +
                        '=' +
                        addProductDataResponse.id + '&' + 'imgurl' + '=' + img.uri,
                        'POST',
                        img.fileData,
                      );
                      imageUpload.then((imageResponse1) => {
                        console.log(imageResponse1,'imageResponse1');
                        this.setState({ isLoading: true, isPressed: true });
                        if (imageResponse1 && imageResponse1.status === 'true') {
                          this.setState({ isImageSave: true, isLoading: false, isPressed: false }, () => {
                            Alert.alert(
                              '',
                              'Product Added Successfully.After Admin Aproval your product will be displayed',
                              [
                                {
                                  text: 'OK',
                                  onPress: () => {
                                    this.props.navigation.push('MyProduct', { isAdd: this.state.isAdd })
                                  },
                                },
                              ],
                              { cancelable: false },
                            );
                          });
                        } else {
                          this.setState({ isImageSave: false, isLoading: false, isPressed: false });
                        }
                      });
                    })
                  }
                }
              })

            } else {
              this.setState({ addProductData: [], isPressed: false })
            }
          })
        } else {
          var data = {
            'accesskey': this.state.accessKeyDetails.key,
            'prodcat': this.state.categoryId,
            'prodsubcat': this.state.subCategoryId,
            'prodname': this.state.productName,
            'proddesc': this.state.productDes,
            'prodprice': this.state.productPrice,
            'prodloct': this.state.productLocation,
            'catpropid': catTitle,
            'catpropval': SubTest,
            'catproptype': catType,
            'subcatpropid': subTitle,
            'subcatpropval': SubValue,
            'subcatproptype': subType,
            'prodid': this.state.productId
          }
          let updateProductData = HttpHelper(UpdateProductUrl
            + 'accesskey' + '=' + data.accesskey + '&' +
            'prodcat' + '=' + data.prodcat + '&' + 'prodsubcat' + '=' +
            data.prodsubcat + '&' + 'prodname' + '=' + data.prodname + '&' + 'proddesc' + '=' + data.proddesc +
            '&' + 'prodprice' + '=' + data.prodprice + '&' + 'prodloct' + '=' + data.prodloct + '&' + 'catpropid' + '=' +
            data.catpropid + '&' + 'catpropval' + '=' + data.catpropval + '&' +
            'catproptype' + '=' + data.catproptype + '&' + 'subcatpropid' + '=' + data.subcatpropid +
            '&' + 'subcatpropval' + '=' + data.subcatpropval + '&' + 'subcatproptype' + '=' + data.subcatproptype + '&' + 'prodid' + '=' + data.prodid, 'POST');
          updateProductData.then((updateProductDataResponse) => {
            this.setState({ isPressed: true });
            if (updateProductDataResponse && updateProductDataResponse.status === 'true') {
              this.setState({ isLoading: false, isPressed: true });
              if (this.state.isImageUpload) {
                if (fileDataList && fileDataList.length > 0) {
                  fileDataList.map(img => {
                    let imageUpload = HttpMultiPartHelper(
                      AddProductImageUrl +
                      'accesskey' +
                      '=' +
                      this.state.accessKeyDetails.key +
                      '&' +
                      'prodid' +
                      '=' +
                      this.state.productId + '&' + 'imgurl' + '=' + img.uri,
                      'POST',
                      img.fileData,
                    );
                    imageUpload.then((uploadImageResponse1) => {
                      this.setState({ isPressed: true });
                      if (uploadImageResponse1 && uploadImageResponse1.status === 'true') {
                        this.setState({ isImageSave: true, isLoading: false, isPressed: false }, () => {
                          Alert.alert(
                            '',
                            'Product Updated Successfully.After Admin Aproval your product will be displayed',
                            [
                              {
                                text: 'OK',
                                onPress: () => {
                                  this.props.navigation.push('MyProduct');
                                },
                              },
                            ],
                            { cancelable: false },
                          );
                        });
                      } else {
                        this.setState({ isImageSave: false, isLoading: false, isPressed: false });
                      }
                    });
                  })
                } else {
                  this.setState({ isLoading: false, isPressed: false }, () => {
                    Alert.alert(
                      '',
                      'Product Updated Successfully.After Admin Aproval your product will be displayed',
                      [
                        {
                          text: 'OK',
                          onPress: () => {
                            this.props.navigation.push('MyProduct');
                          },
                        },
                      ],
                      { cancelable: false },
                    );
                  })
                }

              }
            }
          })
        }
      } else {
        this.dropdown.alertWithType('error', 'Error!', 'Please Choose Product Image');
        this.setState({ isPressed: false })
      }
    } else {
      this.dropdown.alertWithType('error', 'Error!', 'Please Enter All Fields');
      this.setState({ isPressed: false })
    }
  }
  _imageUpload(deleteArray) {
    if (deleteArray) {
      if (this.state.accessKeyDetails) {
        deleteArray.map(datas => {
          let imageUpload = HttpHelper(
            DeleteImageUrl +
            'accesskey' +
            '=' +
            this.state.accessKeyDetails.key +
            '&' +
            'prodid' +
            '=' +
            this.state.productId +
            '&' +
            'imgid' +
            '=' +
            datas.imageId,
            'GET',
          );
          imageUpload.then(deleteResponse => {
            if (deleteResponse && deleteResponse.status === 'true') {
              this.setState({ isLoading: false, isPressed: false }, () => {
                Alert.alert(
                  '',
                  'Product Updated Successfully.After Admin Aproval your product will be displayed',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        this.props.navigation.push('MyProduct');
                      },
                    },
                  ],
                  { cancelable: false },
                );
              });
            }
          })
        })


      }
    }
    // if (this.state.accessKeyDetails) {
    //   fileData.map(datas => {
    //     datas.fileData = []
    //     let imageUpload = HttpMultiPartHelper(
    //       updateProductImageUploadUrl +
    //       'accesskey' +
    //       '=' +
    //       this.state.accessKeyDetails.key +
    //       '&' +
    //       'prodid' +
    //       '=' +
    //       this.state.productId +
    //       '&' +
    //       'imgid' +
    //       '=' +
    //       datas.imageId,
    //       'POST',
    //       datas.fileData
    //     );
    //     imageUpload.then(imageResponse => {
    //       console.log(imageResponse, 'imageResponseimageResponse');
    //       this.setState({ isImageSave: true, isLoading: false, isPressed: false }, () => {
    //         // Alert.alert(
    //         //   '',
    //         //   'Product Updated Successfully.After Admin Aproval your product will be displayed',
    //         //   [
    //         //     {
    //         //       text: 'OK',
    //         //       onPress: () => {
    //         //         this.props.navigation.push('MyProduct');
    //         //       },
    //         //     },
    //         //   ],
    //         //   { cancelable: false },
    //         // );
    //       });
    //     })
    //   })


    // }
  }
  selectImage = type => {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        this.state.valueArray.push({
          "imagePath": response.uri,
          "id": type,
          "icon": <AntDesign
            name="closecircle"
            style={{
              textAlign: 'right'
            }}
            size={18}
            color={Colors.textColor}
          />
        });
        if (type === 1) {
          this.setState({
            profilePic1: {
              uri: response.uri, name: response.fileName, type: response.type, fileSize: response.fileSize * 0.5
            },
          }, () => {
          });
          const source = { uri: response.uri };
          this.setState({ avatarSource1: source, file: response, isImageUpload: true, }, () => {
            fileData1 = new FormData();
            fileData1.append('productimg', {
              uri: this.state.file.uri,
              name: this.state.file.fileName,
              type: this.state.file.type,
              fileSize: this.state.file.fileSize * 0.5
            });
            fileDataList.push({
              "fileData": fileData1,
              'uri': this.state.file.uri
            })

          });
        }
        if (type === 2) {
          this.setState({ profilePic2: { uri: response.uri, name: response.fileName, type: response.type, }, });
          const source = { uri: response.uri };
          this.setState({ avatarSource2: source, file: response, isImageUpload: true, }, () => {
            fileData2 = new FormData();
            fileData2.append('productimg', {
              uri: this.state.file.uri,
              name: this.state.file.fileName,
              type: this.state.file.type,
              fileSize: this.state.file.fileSize * 0.5
            });
            fileDataList.push({
              "fileData": fileData2,
              'uri': this.state.file.uri
            })
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
              fileSize: this.state.file.fileSize * 0.5
            });
            fileDataList.push({
              "fileData": fileData3,
              'uri': this.state.file.uri
            })
          });
        }
        if (type === 4) {
          this.setState({ profilePic4: { uri: response.uri, name: response.fileName, type: response.type, }, });
          const source = { uri: response.uri };
          this.setState({ avatarSource4: source, file: response, isImageUpload: true, }, () => {
            fileData4 = new FormData();
            fileData4.append('productimg', {
              uri: this.state.file.uri,
              name: this.state.file.fileName,
              type: this.state.file.type,
              fileSize: this.state.file.fileSize * 0.5
            });
            fileDataList.push({
              "fileData": fileData4,
              'uri': this.state.file.uri
            })
          });
        }
        if (type === 5) {
          this.setState({ profilePic5: { uri: response.uri, name: response.fileName, type: response.type, }, });
          const source = { uri: response.uri };
          this.setState({ avatarSource5: source, file: response, isImageUpload: true, }, () => {
            fileData5 = new FormData();
            fileData5.append('productimg', {
              uri: this.state.file.uri,
              name: this.state.file.fileName,
              type: this.state.file.type,
              fileSize: this.state.file.fileSize * 0.5
            });
            fileDataList.push({
              "fileData": fileData5,
              'uri': this.state.file.uri
            })
          });
        }
        if (type === 6) {
          this.setState({ profilePic6: { uri: response.uri, name: response.fileName, type: response.type, }, });
          const source = { uri: response.uri };
          this.setState({ avatarSource6: source, file: response, isImageUpload: true, }, () => {
            fileData6 = new FormData();
            fileData6.append('productimg', {
              uri: this.state.file.uri,
              name: this.state.file.fileName,
              type: this.state.file.type,
              fileSize: this.state.file.fileSize * 0.5
            });
            fileDataList.push({
              "fileData": fileData6,
              'uri': this.state.file.uri
            })
          });
        }
        if (type === 7) {
          this.setState({ profilePic7: { uri: response.uri, name: response.fileName, type: response.type, }, });
          const source = { uri: response.uri };
          this.setState({ avatarSource7: source, file: response, isImageUpload: true, }, () => {
            fileData7 = new FormData();
            fileData7.append('productimg', {
              uri: this.state.file.uri,
              name: this.state.file.fileName,
              type: this.state.file.type,
              fileSize: this.state.file.fileSize * 0.5
            });
            fileDataList.push({
              "fileData": fileData7,
              'uri': this.state.file.uri
            })
          });
        }
        if (type === 8) {
          this.setState({ profilePic8: { uri: response.uri, name: response.fileName, type: response.type, }, });
          const source = { uri: response.uri };
          this.setState({ avatarSource8: source, file: response, isImageUpload: true, }, () => {
            fileData8 = new FormData();
            fileData8.append('productimg', {
              uri: this.state.file.uri,
              name: this.state.file.fileName,
              type: this.state.file.type,
              fileSize: this.state.file.fileSize * 0.5
            });
            fileDataList.push({
              "fileData": fileData8,
              'uri': this.state.file.uri
            })
          });
        }
      }
    });
  };
  addComma = (txt) => {
    var numberText = txt.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    this.setState({
      productPrice: numberText
    });
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
            barStyle="light-content"
          />
          <SafeAreaView backgroundColor={Colors.mainBackground} style={AppStyle.barStyle}>
            <View style={AppStyle.secondaryHeaderStyle}>
              <View style={AppStyle.headerContainer}>
                <TouchableOpacity
                  style={AppStyle.headerLeft}
                  onPress={() => {
                    this.props.navigation.push('MyProduct', { getProductDetails: this.state.productId, isChat: true, isUpdate: this.state.isUpdate })
                  }}>
                  <AntDesign
                    style={{ height: 30, alignSelf: 'center' }}
                    name="arrowleft"
                    color={Colors.lightWhiteColor}
                    size={30}
                  />
                </TouchableOpacity>

                <Text numberOfLines={1} style={AppStyle.secondaryHeaderTitle}>{this.state.isAdd ? "Add Product" : 'Update Product'}</Text>

                <TouchableOpacity style={{ width: 40 }}></TouchableOpacity>

                {/* </View> */}
              </View>
            </View>
            <ScrollView
              style={{
                backgroundColor: Colors.lightWhiteColor,
                marginBottom: 50
              }}
              contentInsetAdjustmentBehavior="automatic">
              <KeyboardAvoidingView enabled>
                <View style={{ padding: 30 }}>
                  <View style={AddProductStyle.categoryView}>
                    <Text style={AddProductStyle.textProperty}>Category *</Text>
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
                        {this._renderProperty(this.state.categoryId, this.state.isUpdateData)}
                      </View>
                    </>
                  )}
                  <View style={AddProductStyle.categoryView}>
                    <Text style={AddProductStyle.textProperty}>Sub Category *</Text>
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
                    <Text style={AddProductStyle.textProperty}>Product Name *</Text>
                    <TextInput
                      style={AddProductStyle.textInputView}
                      placeholderTextColor={Colors.placeholderColor}
                      onChangeText={(text) => this.setState({ productName: text })}
                      ref={input => (this.productName = input)}
                      onSubmitEditing={() => this.productPrice.focus()}
                      defaultValue={this.state.productName}
                    />
                  </View>
                  <View style={AddProductStyle.contentView}>
                    <Text style={AddProductStyle.textProperty}>Price *</Text>
                    <TextInput
                      style={AddProductStyle.textInputView}
                      placeholderTextColor={Colors.placeholderColor}
                      onChangeText={this.addComma}
                      keyboardType='numeric'
                      ref={input => (this.productPrice = input)}
                      onSubmitEditing={() => this.productLocation.focus()}
                      defaultValue={this.state.productPrice}
                    />
                  </View>
                  <View style={AddProductStyle.contentView}>
                    <Text style={AddProductStyle.textProperty}>Location *</Text>
                    <TextInput
                      style={AddProductStyle.textInputView}
                      placeholderTextColor={Colors.placeholderColor}
                      onChangeText={(text) => this.setState({ productLocation: text })}
                      ref={input => (this.productLocation = input)}
                      onSubmitEditing={() => this.productDes.focus()}
                      defaultValue={this.state.productLocation}
                    />
                  </View>
                  <View style={[AddProductStyle.contentView]}>
                    <Text style={AddProductStyle.desText}>Description</Text>
                    <TextInput
                      style={[AddProductStyle.desInputView]}
                      placeholderTextColor={Colors.textColor}
                      onChangeText={(text) => this.setState({ productDes: text })}
                      ref={input => (this.productDes = input)}
                      defaultValue={this.state.productDes}
                      numberOfLines={4}
                      multiline={true}
                    />
                  </View>
                  <View style={[AddProductStyle.contentView]}>
                    <Text style={AddProductStyle.desText}>
                      Click on below icon and select multiple product images. First image selected will be product's profile image{'\n'}
                      <Text style={{ fontFamily: 'Poppins-Bold' }}>*Image pixel size 500x500 px</Text></Text>
                  </View>
                  <View style={[AddProductStyle.contentView, { paddingHorizontal: 10 }]}>
                    <TouchableOpacity
                      disabled={(fileDataList && fileDataList.length > 7) ? true : false}
                      onPress={() => this.onImageAdd()}
                      style={AddProductStyle.selectImageView}>
                      <MaterialIcons
                        name="add-circle-outline"
                        size={40}
                        color={Colors.placeholderColor}
                      />
                    </TouchableOpacity>
                    {this.renderBottomComponent()}
                  </View>
                </View>
                <View>
                  <View style={{ paddingBottom: 20 }}></View>
                  {this.state.isAdd ?
                    <TouchableOpacity
                      onPress={() => {
                        this._addProductHandle(this.state.isAdd)
                      }}
                      style={AppStyle.applyAddButton}>
                      {this.state.isPressed ? (
                        <ActivityIndicator size="large" color={Colors.mainBackground} />
                      ) : (
                        <Text style={AppStyle.buttonText}>Add</Text>)}
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                      onPress={() => {
                        this._addProductHandle(this.state.isAdd)
                      }}
                      style={AppStyle.applyAddButton}>
                      {this.state.isPressed ? (
                        <ActivityIndicator size="large" color={Colors.mainBackground} />
                      ) : (
                        <Text style={AppStyle.buttonText}>Update</Text>)}
                    </TouchableOpacity>
                  }
                </View>
              </KeyboardAvoidingView>
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
}

export default AddProduct;
