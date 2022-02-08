import React, { Component } from 'react';
import { Text, View, TextInput, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AddProductStyle } from '../assets/styles/AddProductStyle';
import { Colors } from '../assets/styles/Colors';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import { FilterStyle } from '../assets/styles/FilterStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AppStyle } from '../assets/styles/AppStyle';
import CheckBox from 'react-native-check-box';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('screen');


var getCatProdId = [];
var getSudProdId = [];
var getSubBoolId = [];
var getCatBoolId = [];
var getCatBoolValue = [];
var getSubCatBoolValue = [];
var selectedSubId = [];

export default class AccordionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryData: props && props.getCategory ? props.getCategory : [],
      categoryactiveSections: [],
      categoryType: props && props.categoryType ? props.categoryType : '',
      subCategoryactiveSections: [],
      subCategoryData: props && props.getSubCategory ? props.getSubCategory : [],
      subCategoryType: props && props.subCategoryType ? props.subCategoryType : '',
      activeCat: props && props.activeSections ? props.activeSections : [],
      subActiveCat: props && props.subActiveSections ? props.subActiveSections : [],
      checked: [],
      categoryDetails: props && props.activeSections ? props.activeSections : []
    }
    this._catSections = this._catSections.bind(this);
    this._subCatSections = this._subCatSections.bind(this);
  }
  componentDidMount() {
  }
  _renderCatHeader = (item, index, isActive, sections) => {
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
        )}
      </>
    )
  };

  _renderCatContent = (item) => {
    return (
      <Animatable.View
        animation="zoomIn"
        duration={1200}
        style={FilterStyle.contentAnimateView}>
        <>
          {item.Type === "Dropdown List" &&
            <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10, fontFamily: 'Poppins-Medium' }}>
              {item.title}
            </Text>
          }
          {item.Type === "Boolean" &&
            <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10, fontFamily: 'Poppins-Medium' }}>
              {item.title}
            </Text>
          }
          {item.Type === "Dropdown List" && (
            <View>
              {item.propvalues.map((data, index) => {
                // listData.push(data)
                if (data.hasOwnProperty('isChecked')) {
                  data.isChecked = data.isChecked
                } else {
                  data.isChecked = false
                }
                return (
                  <CheckBox
                    style={FilterStyle.checkBoxView}
                    onClick={() => {
                      // var filterCatIndex = listData.filter((e) => e.value === data.value);
                      // if (filterCatIndex && filterCatIndex.length > 0) {
                      if (item.propvalues[index].isChecked) {
                        item.propvalues[index].isChecked = false
                      } else {
                        item.propvalues[index].isChecked = true
                      }
                      getCatProdId = item.propvalues.filter(e => e.isChecked === true);
                      this.props.onCatPropSelected(getCatProdId, '', 'Dropdown List')
                      this.forceUpdate()
                      // }
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
                    rightTextStyle={{ fontFamily: 'Poppins-Medium' }}
                  />
                )
              })}
              <Text style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.placeholderColor,
                marginHorizontal: 10,
              }}></Text>
            </View>
          )}
          {item.Type === "Boolean" &&
            (
              <View>
                {item.propvalues.map((val, index) => {
                  if (val.hasOwnProperty('isChecked')) {
                    val.isChecked = val.isChecked
                  } else {
                    val.isChecked = false
                  }
                  return (
                    <CheckBox
                      style={FilterStyle.checkBoxView}
                      onClick={() => {
                        if (item.propvalues[index].isChecked) {
                          item.propvalues[index].isChecked = false
                        } else {
                          item.propvalues[index].isChecked = true
                        }
                        getCatBoolId = item.propvalues.filter(e => e.isChecked === true);
                        getCatBoolValue.push({ 'id': item.id })
                        this.props.onCatPropSelected(getCatBoolValue, getCatBoolId, 'Boolean')
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
                      rightText={val.value}
                      value={val.value}
                      key={val.value}
                      rightTextStyle={{ fontFamily: 'Poppins-Medium' }}
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
      </Animatable.View>)
  }

  _catSections = (item, activeSections, isActive) => {
    this.setState({
      categoryactiveSections: activeSections
    })
    this.props.onCatSelected(item, this.state.categoryactiveSections, isActive)
  }
  _renderSubHeader = (item, index, isActive) => {
    item.isActive = false;
    if (isActive) {
      item.isActive = true;
    }
    // console.log(item, '_renderSubHeader');
    if (item.hasOwnProperty('isActive')) {
      item.isActive = item.isActive
    } else {
      item.isActive = false
    }
    return (
      <Animatable.View key={item.id}
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
        {/* <View>
              <CheckBox
                style={FilterStyle.checkBoxView}
                onClick={(index) => {
                  console.log(item.id);
                  if (item[index].isActive) {
                    item[index].isActive = false
                  } else {
                    item[index].isActive = true
                  }                 
                  // const idVal = data.filter(e => e.isChecked === true);
                  // console.log(idVal, 'idVal');
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
                isChecked={item.isActive}
              // rightText={data.title}
              // value={data.value}
           // key={index}
              // rightTextStyle={{ fontFamily: 'Poppins-Medium' }}
              />
            </View> */}
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
                <Text style={{ fontSize: 16, margin: 10, fontFamily: 'Poppins-Medium' }}>
                  {data.title}
                </Text>
              }
              {data.Type === "Boolean" &&
                <Text style={{ fontSize: 16, margin: 10, fontFamily: 'Poppins-Medium' }}>
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
                            this.props.onSubCatPropSelected(getSudProdId, '', "Dropdown List")
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
                        rightTextStyle={{ fontFamily: 'Poppins-Medium' }}
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
                            if (data.propvalues[index].isChecked) {
                              data.propvalues[index].isChecked = false
                            } else {
                              data.propvalues[index].isChecked = true
                            }
                            getSubBoolId = data.propvalues.filter(e => e.isChecked === true);
                            getSubCatBoolValue.push({ "id": data.id })
                            this.props.onSubCatPropSelected(getSubCatBoolValue, getSubBoolId, "Boolean")
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
                          rightText={val.value}
                          value={val.value}
                          key={val.value}
                          rightTextStyle={{ fontFamily: 'Poppins-Medium' }}
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

  _subCatSections = (item, activeSections, isActive) => {
    console.log(item, 'item');
    this.setState({
      subCategoryactiveSections: activeSections
    })
    var filterSubHeadId = [];
    activeSections.map((e, key) => {
      filterSubHeadId.push({
        "id": e
      })
    })
    var filterSubId = [];
    var filterSubHeadValue = [];
    var tempList;
    var filterSubValue
    if (filterSubHeadId && filterSubHeadId.length > 0) {
      filterSubHeadId.map((id, i) => {
        tempList = id.id
        filterSubHeadValue = item.filter((e, index) => index === tempList)
        if (filterSubHeadValue && filterSubHeadValue.length > 0) {
          const titleSubDrop = selectedSubId.findIndex((e, index) => index === id.id)
          if (titleSubDrop != -1) {
            selectedSubId = selectedSubId.splice(titleSubDrop, 1)
          } else {
            selectedSubId.push({
              "id": filterSubHeadValue[0].id,
              "title": filterSubHeadValue[0].title,
            })
          }
          this.props.onSubCatSelected(selectedSubId)

        }
      })
    } else {
      selectedSubId = [];
      if (getSudProdId) {
        getSudProdId.map(e => {
          e.isChecked = false
        })
      }
      if (getSubBoolId) {
        getSubBoolId.map(bool => {
          bool.isChecked = false
        })
      }
    }
    this.props.onSubCatSelected(item, selectedSubId, isActive)
  }

  render() {
    return (
      <>
        {this.state.categoryType === "Category" && (
          <Accordion
            // touchableProps={{onPress  () {
            //   checkedVal = true }}}
            sections={this.state.categoryData}
            keyExtractor={index => this.props.keyValue}
            activeSections={this.state.categoryactiveSections}
            renderHeader={this._renderCatHeader}
            renderContent={this._renderCatContent}
            onChange={(value) => { this._catSections(this.state.categoryData, value) }}
            expandMultiple={true}
            underlayColor={Colors.underlayColor}
            duration={200}
          />
        )}
        {this.state.subCategoryType === "SubCategory" && (
          <Accordion
            sections={this.state.subCategoryData}
            keyExtractor={index => this.props.keyValue}
            activeSections={this.state.subCategoryactiveSections}
            renderHeader={this._renderSubHeader}
            renderContent={this._renderSubContent}
            onChange={(value) => { this._subCatSections(this.state.subCategoryData, value) }}
            expandMultiple={true}
            underlayColor={Colors.underlayColor}
            duration={200}
          />
        )}
      </>
    )
  }
}
