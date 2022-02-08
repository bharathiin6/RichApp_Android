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
  TextInput, Dimensions
} from 'react-native';
import { AppStyle } from '../assets/styles/AppStyle';
import { FilterStyle } from '../assets/styles/FilterStyle';
import { Styles } from '../auth/Styles';
import Icon from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from '../assets/styles/Colors';
import Accordion from 'react-native-collapsible/Accordion';
import Header from '../components/Header';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CheckBox from 'react-native-check-box';
const { width, height } = Dimensions.get('screen');
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddProductsDetailsUrl, SearchProductUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper, HttpAuthHelper } from '../HelperApi/Api/HTTPHelper';
import DropdownAlert from 'react-native-dropdownalert';
import Home from '../container/HomeScreen';

var subPropValues = [];
var subDetails = [];
var subCategoryId = ''
var catProperty = [];
var subProperty = [];
var getCatProdId = [];
var listData = [];
var catBoolPropVal = "";
var subBooleanValues = [{
  id: "1",
  bolValue: 'True',
  key: 1
},
{
  id: "2",
  bolValue: 'False',
  key: 2

}
]
var catBooleanValues = [{
  id: "1",
  bolValue: 'True'
},
{
  id: "2",
  bolValue: 'False'
}
]
var selectedSubId = [];
var getSudProdId = [];
var getSubBoolId = [];
var selectedSubBoolId = [];
var subBollPropVal = '';
var subDropPropVal = '';
var selectSub = '';
var getSubId = '';
var getCatId = '';
var selectCat = '';
var selectedCatId = [];
var getCatBoolId = [];

class FilterScreen extends Component {
  constructor(props) {
    super(props);
    var params = this.props.route.params;
    this.state = {
      filterData: [],
      activeSections: [],
      isCheckedQuantity: false,
      isCheckedWeight: false,
      isCheckedCoin: false,
      isCheckedOther: false,
      quantityData: [],
      weightData: [],
      coinData: [],
      propertyDetails: [],
      categoryDetails: [],
      subCategoryactiveSections: [],
      subProperty: [],
      catProperty: [],
      subSubValues: [],
      booleanValue: false,
      isExpand: false,
      categoryactiveSections: [],
      filterProductData: []

    }

  }
  getDetails = () => {
    AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
      if (accessKeyDetails != null) {
        this.setState({
          accessKeyDetails: JSON.parse(accessKeyDetails),
          isLoading: true,
        }, () => {
          let propertyDetails = HttpHelper(
            AddProductsDetailsUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
          propertyDetails.then((response) => {
            this.setState({ isLoading: true })
            if (response.status === 'true') {
              this.setState({
                propertyDetails: response,
                isLoading: false,
                categoryDetails: response.Category
              })
            } else {
              this.setState({
                propertyDetails: [],
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


  _updateSections = (activeSections) => {
    var filterCatHeadId = [];
    var filterCatHeadValue = [];
    activeSections.map((e, key) => {
      filterCatHeadId.push({
        "id": key
      })
    })
    var tempList
    filterCatHeadId.map((item, i) => {
      tempList = item.id
      filterCatHeadValue = this.state.categoryDetails.filter((item, index) => index === tempList)
      if (filterCatHeadValue && filterCatHeadValue.length > 0) {
        var titleNameDrop = selectedCatId.findIndex((e, index) => index === item.id)
        if (titleNameDrop != -1) {
          selectedCatId = selectedCatId.splice(titleNameDrop, 1)
        } else {
          selectedCatId.push({
            "id": filterCatHeadValue[0].id,
            "title": filterCatHeadValue[0].title,
          })
        }
      }
    })

    this.setState({ activeSections })
  };
  _subCatSections = (activeSections) => {
    this.setState({
      subCategoryactiveSections: activeSections,

    })
    var filterSubHeadId = [];
    var filterSubHeadValue = [];
    activeSections.map((e, key) => {
      filterSubHeadId.push({
        "id": key
      })
    })
    var tempList;
    filterSubHeadId.map((item, i) => {
      tempList = item.id
      filterSubHeadValue = this.state.categoryDetails[0].subcat.filter((item, index) => index === tempList)
      if (filterSubHeadValue && filterSubHeadValue.length > 0) {
        var titleSubDrop = selectedSubId.findIndex((e, index) => index === item.id)
        if (titleSubDrop != -1) {
          selectedSubId = selectedSubId.splice(titleSubDrop, 1)
        } else {
          selectedSubId.push({
            "id": filterSubHeadValue[0].id,
            "title": filterSubHeadValue[0].title,
          })
        }
      }
    })
  }
  _catSections = (activeSections) => {
    this.setState({
      categoryactiveSections: activeSections,
    })
    var filterSubHeadId = [];
    var filterSubHeadValue = [];
    activeSections.map((e, key) => {
      filterSubHeadId.push({
        "id": key
      })
    })
    var tempList;
    filterSubHeadId.map((item, i) => {
      tempList = item.id
      filterSubHeadValue = this.state.categoryDetails[0].subcat.filter((item, index) => index === tempList)
      if (filterSubHeadValue && filterSubHeadValue.length > 0) {
        var titleSubDrop = selectedSubId.findIndex((e, index) => index === item.id)
        if (titleSubDrop != -1) {
          selectedSubId = selectedSubId.splice(titleSubDrop, 1)
        } else {
          selectedSubId.push({
            "id": filterSubHeadValue[0].id,
            "title": filterSubHeadValue[0].title,
          })
        }
      }
    })
  }

  _renderHeader = (item, index, isActive) => {
    let indexVal = this.state.activeSections;
    let currentObj = item[indexVal];
    if (item.hasOwnProperty('isChecked')) {
      item.isChecked = item.isChecked
    } else {
      item.isChecked = false
    }
    return (
      <>
        {/* {(item.Type ==="Dropdown List"  || item.Type ==="Boolean")  && ( */}
        <Animatable.View
          animation="zoomIn"
          duration={1200}
          style={FilterStyle.animateView}>
          <Text style={FilterStyle.accordianText}>{item.title}</Text>
          <FontAwesome
            name={isActive ? "check-square-o" : 'square-o'}
            style={AppStyle.iconShadow}
            size={30}
            color={Colors.buttonColor}
          />
        </Animatable.View>
        {/* )} */}
      </>
    );
  };
  _renderSubHeader = (item, _, isActive) => {
    return (
      <Animatable.View
        animation="zoomIn"
        duration={1200}
        style={FilterStyle.animateView}>
        <Text style={FilterStyle.accordianText}>{item.title}</Text>
        <FontAwesome
          name={isActive ? "check-square-o" : 'square-o'}
          style={AppStyle.iconShadow}
          size={30}
          color={Colors.buttonColor}
        />
      </Animatable.View>
    );
  };

  _renderSubContent = (item) => {
    return (
      <Animatable.View
        animation="zoomIn"
        duration={1200}
        style={FilterStyle.contentAnimateView}>
        {item.subpropvalues.map((data, index) => {
          return (
            <>
              {data.Type === "Dropdown List" &&
                <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>
                  {data.title}
                </Text>
              }
              {data.Type === "Boolean" &&
                <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>
                  {data.title}
                </Text>
              }
              {data.Type === "Dropdown List" && (
                <View>
                  {data.propvalues.map((val, index) => {
                    if (val.hasOwnProperty('isChecked')) {
                      val.isChecked = val.isChecked
                    } else {
                      val.isChecked = false
                    }
                    return (
                      <CheckBox
                        style={FilterStyle.checkBoxView}
                        onClick={() => {
                          var filterIndex = data.propvalues.filter((e) => e.value === val.value);
                          if (filterIndex && filterIndex.length > 0) {
                            if (data.propvalues[index].isChecked) {
                              data.propvalues[index].isChecked = false
                            } else {
                              data.propvalues[index].isChecked = true
                            }
                            getSudProdId = data.propvalues.filter(e => e.isChecked === true);
                            this.forceUpdate()
                          }
                        }}
                        checkedImage={<FontAwesome
                          name={"check-square-o"}
                          style={AppStyle.iconShadow}
                          size={30}
                          color={Colors.buttonColor}
                        />
                        }
                        unCheckedImage={<FontAwesome
                          name={'square-o'}
                          style={AppStyle.iconShadow}
                          size={30}
                          color={Colors.buttonColor}
                        />}

                        isChecked={val.isChecked}
                        rightText={val.title}
                        value={val.id}
                        key={index}
                      />
                    )
                  })}
                  <Text style={{
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.placeholderColor,
                    marginHorizontal: 10,
                  }}></Text>
                </View>
              )
              }
              {data.Type === "Boolean" &&
                (
                  <View>
                    {subBooleanValues.map((val, index) => {
                      if (val.hasOwnProperty('isChecked')) {
                        val.isChecked = val.isChecked
                      } else {
                        val.isChecked = false
                      }
                      return (
                        <CheckBox
                          style={FilterStyle.checkBoxView}
                          onClick={() => {
                            if (subBooleanValues[index].isChecked) {
                              subBooleanValues[index].isChecked = false
                            } else {
                              subBooleanValues[index].isChecked = true
                            }
                            getSubBoolId = subBooleanValues.filter(e => e.isChecked === true);
                            this.forceUpdate()
                          }}
                          checkedImage={<FontAwesome
                            name={"check-square-o"}
                            style={AppStyle.iconShadow}
                            size={30}
                            color={Colors.buttonColor}
                          />
                          }
                          unCheckedImage={<FontAwesome
                            name={'square-o'}
                            style={AppStyle.iconShadow}
                            size={30}
                            color={Colors.buttonColor}
                          />}
                          isChecked={val.isChecked}
                          rightText={val.bolValue}
                          value={val.bolValue}
                          key={index}
                        />)
                    })}
                    <Text style={{
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.placeholderColor,
                      marginHorizontal: 10,
                    }}></Text>

                  </View>)
              }
              {data.Type === "Text" &&
                <View></View>
              }
            </>
          )
        })}

      </Animatable.View>
    )
  }
  _renderSubHeader = (item, _, isActive) => {
    return (
      <Animatable.View
        animation="zoomIn"
        duration={1200}
        style={FilterStyle.animateView}>
        <Text style={FilterStyle.accordianText}>{item.title}</Text>
        <FontAwesome
          name={isActive ? "check-square-o" : 'square-o'}
          style={AppStyle.iconShadow}
          size={30}
          color={Colors.buttonColor}
        />
      </Animatable.View>
    );
  };
  _renderCatHeader = (item, _, isActive) => {
    return (
      <>
        {(item.Type === "Dropdown List" || item.Type === "Boolean") && (
          <Animatable.View
            animation="zoomIn"
            duration={1200}
            style={FilterStyle.animateView}>
            <Text style={FilterStyle.accordianText}>{item.title}</Text>

            <FontAwesome
              name={isActive ? "check-square-o" : 'square-o'}
              style={AppStyle.iconShadow}
              size={30}
              color={Colors.buttonColor}
            />
          </Animatable.View>
        )
        }
      </>
    );
  };
  _renderCatContent = (item) => {
    return (
      <Animatable.View
        animation="zoomIn"
        duration={1200}
        style={FilterStyle.contentAnimateView}>
        <>
          {item.Type === "Dropdown List" &&
            <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>
              {item.title}
            </Text>
          }
          {item.Type === "Boolean" &&
            <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>
              {item.title}
            </Text>
          }
          {item.Type === "Dropdown List" && (
            <View>
              {item.propvalues.map((data, index) => {
                if (data.hasOwnProperty('isChecked')) {
                  data.isChecked = data.isChecked
                } else {
                  data.isChecked = false
                }
                // data.isChecked = false
                return (
                  <CheckBox
                    style={FilterStyle.checkBoxView}
                    onClick={() => {
                      listData.push(data)
                      var filterCatIndex = listData.filter((e) => e.value === data.value);
                      if (filterCatIndex && filterCatIndex.length > 0) {
                        if (listData[index].isChecked) {
                          listData[index].isChecked = false
                        } else {
                          listData[index].isChecked = true
                        }
                        getCatProdId = listData.filter(e => e.isChecked === true);
                        this.forceUpdate()
                      }

                    }}
                    checkedImage={<FontAwesome
                      name={"check-square-o"}
                      style={AppStyle.iconShadow}
                      size={30}
                      color={Colors.buttonColor}
                    />
                    }
                    unCheckedImage={<FontAwesome
                      name={'square-o'}
                      style={AppStyle.iconShadow}
                      size={30}
                      color={Colors.buttonColor}
                    />}
                    isChecked={data.isChecked}
                    rightText={data.title}
                    value={data.value}
                    key={index}
                  />
                )
              })}
              <Text style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.placeholderColor,
                marginHorizontal: 10,
              }}></Text>
            </View>
          )
          }
          {item.Type === "Boolean" &&
            (
              <View>
                {catBooleanValues.map((val, index) => {
                  if (val.hasOwnProperty('isChecked')) {
                    val.isChecked = val.isChecked
                  } else {
                    val.isChecked = false
                  }
                  return (
                    <CheckBox
                      style={FilterStyle.checkBoxView}
                      onClick={() => {
                        if (catBooleanValues[index].isChecked) {
                          catBooleanValues[index].isChecked = false
                        } else {
                          catBooleanValues[index].isChecked = true
                        }
                        getCatBoolId = catBooleanValues.filter(e => e.isChecked === true);
                        this.forceUpdate()
                      }}
                      isChecked={val.isChecked}
                      rightText={val.bolValue}
                      value={val.id}
                      key={index}
                    />)
                })}
                <Text style={{
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.placeholderColor,
                  marginHorizontal: 10,
                }}></Text>

              </View>)
          }
          {item.Type === "Text" &&
            <View></View>
          }
        </>



      </Animatable.View>
    )
  }

  _renderContent = (item) => {
    return (
      <>
        <Animatable.View
          animation="zoomIn"
          duration={1200}
          style={FilterStyle.contentAnimateView}>
          <View>
            <Accordion
              sections={item.catproperty}
              activeSections={this.state.categoryactiveSections}
              renderHeader={this._renderCatHeader}
              renderContent={this._renderCatContent}
              onChange={this._catSections}
              expandMultiple={true}
              underlayColor={Colors.underlayColor}
            />
          </View>
        </Animatable.View>
        <Animatable.View
          animation="zoomIn"
          duration={1200}
          style={FilterStyle.contentAnimateView}>
          <View>
            <Accordion
              sections={item.subcat}
              activeSections={this.state.subCategoryactiveSections}
              renderHeader={this._renderSubHeader}
              renderContent={this._renderSubContent}
              onChange={this._subCatSections}
              expandMultiple={true}
              underlayColor={Colors.underlayColor}
            />
          </View>
          <View style={FilterStyle.borderView}></View>
        </Animatable.View>

      </>
    );
  };

  onFilter = () => {
    if (selectedCatId && selectedCatId.length > 0) {
      selectedCatId.map(e => {
        if (getCatId != "") {
          getCatId = getCatId + "," + e.id;
        } else {
          getCatId = e.id
        }
      })
    }
    if (selectedSubId && selectedSubId.length) {
      selectedSubId.map(e => {
        if (getSubId != "") {
          getSubId = getSubId + "," + e.id;
        } else {
          getSubId = e.id
        }
      })
    }
    if (getSudProdId && getSudProdId.length > 0) {
      getSudProdId.map(e => {
        if (selectSub != "") {
          selectSub = selectSub + "," + e.value;
        } else {
          selectSub = e.value
        }
      })
    }
    if (getCatProdId && getCatProdId.length > 0) {
      getCatProdId.map(e => {
        if (selectCat != "") {
          selectCat = selectCat + "," + e.value;
        } else {
          selectCat = e.value
        }
      })
    }
    if (getSubBoolId) {
      getSubBoolId.map(e => {
        if (subBollPropVal != "") {
          subBollPropVal = subBollPropVal + "," + e.bolValue;
        } else {
          subBollPropVal = e.bolValue
        }
      })

    }
    if (getCatBoolId) {
      getCatBoolId.map(e => {
        if (catBoolPropVal != "") {
          catBoolPropVal = catBoolPropVal + e.bolValue
        } else {
          catBoolPropVal = e.bolValue
        }
      })
    }
    var data = {
      'accesskey': this.state.accessKeyDetails.key,
      'mcatid': getCatId,
      'scatid': getSubId,
      'mcatpropv': selectCat ? selectCat + ',' : '' + catBoolPropVal,
      'scatpropv': selectSub ? selectSub + ',' : '' + subBollPropVal,
      'searchprod': this.state.searchKeyword ? this.state.searchKeyword : "",
    }
    let filterProdut = HttpHelper(SearchProductUrl
      + 'accesskey' + '=' + data.accesskey + '&' +
      'mcatid' + '=' + data.mcatid + '&' + 'scatid' + '=' +
      data.scatid + '&' + 'mcatpropv' + '=' + data.mcatpropv + '&' + 'scatpropv' + '=' + data.scatpropv +
      '&' + 'searchprod' + '=' + data.searchprod, 'POST');
    filterProdut.then((response) => {
      if (response && response.status === 'true') {
        this._navigateToChild(response)
      }
    })
  }

  _navigateToChild(response) {
    if (response) {
      this.props.navigation.navigate('Shop', { getProduct: response.Products })
      this.setState({
        filterProductData: response.Products
      })
    }
  }

  render() {
    return (
      <>
        <StatusBar
          backgroundColor={Colors.mainBackground}
          barStyle="dark-content"
        />
        <SafeAreaView style={AppStyle.barStyle}>
          {/* <SecondaryHeader
              navigation={this.props.navigation}
              title={'Profile'}
              isLoggedin={false}
            /> */}
          {/* <Header navigation={this.props.route.navigation} title={'Home'} isLoggedin={false} /> */}
          <ScrollView
            style={{ backgroundColor: Colors.lightWhiteColor }}
            contentInsetAdjustmentBehavior="automatic">
            <View style={FilterStyle.accordianView}>
              {this.state.categoryDetails && this.state.categoryDetails.length > 0 && (
                <Accordion
                  sections={this.state.categoryDetails}
                  keyExtractor={item => item.key}
                  activeSections={this.state.activeSections}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                  onChange={this._updateSections}
                  expandMultiple={true}
                  underlayColor={Colors.underlayColor}
                />
              )}
              <TouchableOpacity
                onPress={() => {
                  this.onFilter()
                }}
                style={AppStyle.applyButton}>
                <Text style={AppStyle.buttonText}>Apply</Text>
              </TouchableOpacity>
            </View>
            {/* {
              (this.state.filterProductData && this.state.filterProductData.length>0) &&(
                <Home navigation={this.props.navigation} products ={this.state.filterProductData}/>

              ) 

            } */}
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

export default FilterScreen;
