import React, { Component } from 'react'
import { Text, View, TextInput } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { AddProductStyle } from '../assets/styles/AddProductStyle';
import { Colors } from '../assets/styles/Colors';

var subBooleanValues = [{
    id: "1",
    bolValue: 'True'
},
{
    id: "2",
    bolValue: 'False'
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
var pushText = [];
var pushLAbel = [];
var subCategoryLabel = [];
var catNameValue = [];
var catName = [];
export default class PickerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            getCategory: props && props.category ? props.propValues : [],
            getCategoryType: props && props.category ? props.propValues.Type : '',
            getCategoryPropValue: props && props.category && props.propValues ? props.propValues.propvalues : [],
            subCategory: props && props.subCategory ? props.propValues : [],
            subCategoryType: props && props.subCategory && props.propValues.Type ? props.propValues.Type : '',
            subPropValues: props && props.subCategory && props.propValues ? props.propValues.propvalues : [],
            isCategory: props && props.category ? props.category : false,
            isSubCategory: props && props.subCategory ? props.subCategory : false,
            categoryLabelName: props && props.catLabelName ? props.catLabelName : '',
            subLabelName: props && props.subLabelName ? props.subLabelName : '',
            updatedCategoryValues: props && props.updateValues ? props.updateValues : [],
            updatedSubCategoryValues: props && props.updateSubValues ? props.updateSubValues : [],
            getPropValues: props && props.propValues ? props.propValues.propvalues : [],
            updateType: props && props.updateType ? props.updateType : false,
            isUpdateProps: props && props.isUpdateProps ? props.isUpdateProps : false
        }
        this.updateSubPropItem = this.updateSubPropItem.bind(this);
        this.updateSubPropBoolItem = this.updateSubPropBoolItem.bind(this);
        this.updateCatPropItem = this.updateCatPropItem.bind(this);
        this.updateCatPropBoolItem = this.updateCatPropBoolItem.bind(this);
        this.updateCatText = this.updateCatText.bind(this);
        this.updateSubText = this.updateSubText.bind(this);
    }
    componentDidMount() {
        if (this.state.updatedCategoryValues && this.state.updatedCategoryValues.length > 0) {
            this.state.updatedCategoryValues[0].catpropval.map((e, i, index) => {
                if (e.proptype === "Text") {
                    this.setState({
                        catName: e.propval
                    })
                }
                if (this.state.updateType != '') {
                    this.setState({
                        catName: '',
                        categoryLabelName: '',
                    })
                }
                if (e.proptype === "Dropdown List") {
                    if (this.state.getCategory) {
                        const findIndexVaue = this.state.getCategory.propvalues.findIndex(val => val.value === e.propvalid)
                        this.setState({
                            selectedCatId: findIndexVaue,
                        })
                    }
                }
                if (e.proptype === "Boolean") {
                    if (e.propval === "True") {
                        this.setState({
                            selectedBoolId: 1,
                        })
                    } else {
                        this.setState({
                            selectedBoolId: 2,
                        })
                    }
                }
            })
        }
        if (this.state.updatedSubCategoryValues && this.state.updatedSubCategoryValues.length > 0 && this.state.updatedSubCategoryValues[0].catpropval) {
            this.state.updatedSubCategoryValues[0].catpropval.map((e, i) => {
                if (e.proptype === "Text") {
                    this.setState({
                        subName: e.propval
                    })
                }
                if (e.proptype === "Dropdown List") {
                    const findIndexVaue = this.state.subCategory.propvalues.findIndex(val => val.value === e.propvalid)
                    this.setState({
                        selectedSubId: findIndexVaue,
                    })
                }
                if (e.proptype === "Boolean") {
                    if (e.propval === "True") {
                        this.setState({
                            selectedSubBoolId: 1,
                        })
                    } else {
                        this.setState({
                            selectedSubBoolId: 2,
                        })
                    }
                }
            })

        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.setState({
                updatedCategoryValues: nextProps.updateValues && nextProps.updateValues.length > 0 ? nextProps.updateValues : [],
                getCategory: nextProps && nextProps.category ? nextProps.propValues : [],
                getCategoryType: nextProps && nextProps.category ? nextProps.propValues.Type : '',
                getCategoryPropValue: nextProps && nextProps.category && nextProps.propValues ? nextProps.propValues.propvalues : [],
                subCategory: nextProps && nextProps.subCategory ? nextProps.propValues : [],
                subCategoryType: nextProps && nextProps.subCategory && nextProps.propValues.Type ? nextProps.propValues.Type : '',
                subPropValues: nextProps && nextProps.subCategory && nextProps.propValues ? nextProps.propValues.propvalues : [],
                updateType: nextProps && nextProps.updateType ? nextProps.updateType : false,
                categoryLabelName: nextProps && nextProps.catLabelName ? nextProps.catLabelName : '',
                subLabelName: nextProps && nextProps.subLabelName ? nextProps.subLabelName : '',
                updatedSubCategoryValues: nextProps && nextProps.updateSubValues ? nextProps.updateSubValues : [],
                isUpdateProps: nextProps && nextProps.isUpdateProps ? nextProps.isUpdateProps : false

            }, () => {
                if (this.state.updateType) {
                    this.setState({
                        catName: '',
                        updatedCategoryValues: [],
                    })
                }
            })
        }
    }

    updateSubPropItem = (id, item) => {
        if (item && item.propvalues && item.propvalues.length > 0) {
            var filterValue = item.propvalues.filter((e, index) => index === id)
        }
        this.setState({
            selectedSubId: id,
            subPropTitleId: item.id,
            subPropTitleType: item.Type
        })
        this.props.onSelected(id, item, 'Dropdown List');
    }
    updateCatPropItem = (id, item) => {
        this.setState({
            selectedCatId: id,
            catPropTitleId: item.id,
            catPropTitleType: item.Type
        })
        this.props.onCatSelected(id, item, 'DropDown List');
    }
    _renderSubCategoryDropDownValue = (subCategoryType, subPropValues) => {
        if (subCategoryType === "Dropdown List" && subPropValues && subPropValues != null) {
            return subPropValues.map((value, index) => {
                return (
                    <Picker.Item label={value.title} value={index} key={index} />
                )
            })
        }
    }
    _renderCategoryDropDownValue = (subCategoryType, subPropValues) => {
        if (subCategoryType === "Dropdown List" && subPropValues && subPropValues != null) {
            return subPropValues.map((value, index) => {
                return (
                    <Picker.Item label={value.title} value={index} key={index} />
                )
            })
        }
    }
    updateSubPropBoolItem = (id, item) => {
        this.setState({
            selectedSubBoolId: id,
            selectBoolLabel: id === "1" ? "True" : "False",
            subPropBoolTitleId: item.id,
            subPropBoolTitleType: item.Type
        })
        this.props.onSelected(id, item, 'Boolean', this.state.subLabelName);
    }
    updateCatPropBoolItem = (id, item) => {
        this.setState({
            selectedBoolId: id,
            selectBoolLabel: id === "1" ? "True" : "False",
            subPropBoolTitleId: item.id,
            subPropBoolTitleType: item.Type
        })
        this.props.onCatSelected(id, item, 'Boolean', this.state.subLabelName);
    }
    updateCatText = (text, key) => {
        this.setState({
            catName: text,
            updatedCategoryValues: []
        })
        this.props.onCatSelected(text, this.state.categoryLabelName, 'Text')
    }
    updateSubText = (text, keyValue) => {
        this.setState({
            subName: text
        }, () => {
            pushText.push({
                "id": this.props.keyValue,
                "text": this.state.subName
            })
        })
        this.props.onSelected(text, this.state.subLabelName, 'Text')
    }


    render() {
        const { subCategory, subCategoryType, subPropValues, getCategory, getCategoryPropValue, getCategoryType } = this.state;
        return (
            <>
                {this.state.isCategory &&
                    getCategoryType === "Dropdown List" ? (
                    <View style={AddProductStyle.pickerCategoryView}>
                        <Picker
                            selectedValue={this.state.selectedCatId}
                            key={this.props.keyValue}
                            style={AddProductStyle.pickerCompStyle}
                            mode="dropdown"
                            onValueChange={(itemValue, id) => {
                                setTimeout(() => {
                                    this.updateCatPropItem(itemValue, getCategory);
                                }, 0);
                            }}>
                            <Picker.Item
                                color={Colors.placeholderColor}
                                label={'Choose From List'}
                                value={0}
                            />
                            {this._renderCategoryDropDownValue(getCategoryType, getCategoryPropValue)}
                        </Picker>
                    </View>) :
                    getCategoryType === "Boolean" ? <View style={AddProductStyle.pickerCategoryView}>
                        <Picker
                            selectedValue={this.state.selectedBoolId}
                            key={this.props.keyValue}
                            style={AddProductStyle.pickerCompStyle}
                            mode="dropdown"
                            onValueChange={(itemValue) => {
                                setTimeout(() => {
                                    this.updateCatPropBoolItem(itemValue, catBooleanValues, getCategory);
                                }, 0);
                            }}>
                            <Picker.Item color={Colors.placeholderColor} label={'Choose From List'} value={0} />
                            <Picker.Item color={Colors.textColor} label={'True'} value={1} />
                            <Picker.Item color={Colors.textColor} label={'False'} value={2} />
                        </Picker>
                    </View> :
                        getCategoryType === "Text" && (
                            <View>
                                <TextInput
                                    key={this.props.keyValue}
                                    style={AddProductStyle.pickerTextInputView}
                                    placeholderTextColor={Colors.placeholderColor}
                                    onChangeText={(text, index) => this.updateCatText(text, index)}
                                    defaultValue={this.state.catName}
                                /></View>)

                }
                {this.state.isSubCategory &&
                    (subCategoryType === "Dropdown List" ? (
                        <View style={AddProductStyle.pickerCategoryView}>
                            <Picker
                                selectedValue={this.state.selectedSubId}
                                key={this.props.key}
                                style={AddProductStyle.pickerCompStyle}
                                mode="dropdown"
                                onValueChange={(itemValue) => {
                                    setTimeout(() => {
                                        this.updateSubPropItem(itemValue, subCategory);
                                    }, 0);
                                }}
                            >
                                <Picker.Item
                                    color={Colors.placeholderColor}
                                    label={'Choose From List'}
                                    value={0}
                                />
                                {this._renderSubCategoryDropDownValue(subCategoryType, subPropValues)}
                            </Picker>
                        </View>) : subCategoryType === "Boolean" ? <View style={AddProductStyle.pickerCategoryView}>
                            <Picker
                                selectedValue={this.state.selectedSubBoolId}
                                key={this.props.key}
                                style={AddProductStyle.pickerCompStyle}
                                mode="dropdown"
                                onValueChange={(itemValue) => {
                                    setTimeout(() => {
                                        this.updateSubPropBoolItem(itemValue, subBooleanValues);
                                    }, 0);
                                }}>
                                <Picker.Item color={Colors.placeholderColor} label={'Choose From List'} value={0} />
                                <Picker.Item color={Colors.textColor} label={'True'} value={1} />
                                <Picker.Item color={Colors.textColor} label={'False'} value={2} />
                            </Picker>
                        </View> : (
                        <TextInput
                            style={AddProductStyle.pickerTextInputView}
                            placeholderTextColor={Colors.placeholderColor}
                            onChangeText={(text) => this.updateSubText(text)}
                            defaultValue={this.state.subName}
                        />
                    )
                    )
                }
            </>
        )
    }
}
