import React, { Component } from 'react'
 import { Text, TextInput, View, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { AppStyle } from '../assets/styles/AppStyle'
import { Colors } from '../assets/styles/Colors'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AllProductUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper, HttpMultiPartHelper } from '../HelperApi/Api/HTTPHelper';
import DropdownAlert from 'react-native-dropdownalert';
import Autocomplete from 'react-native-autocomplete-input';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('screen');

export default class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            AllProduct: [],
            accessKeyDetails: {},
            searchText: '',
        };
    }
     componentDidMount() {
        this.setState({ isLoading: true })
        AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
            if (accessKeyDetails != null) {
                var keyData = JSON.parse(accessKeyDetails);
                this.setState({ accessKeyDetails: JSON.parse(accessKeyDetails) }, () => {
                    if (this.state.accessKeyDetails) {

                        let filterProduct = HttpHelper(
                            AllProductUrl +
                            'accesskey' +
                            '=' +
                            this.state.accessKeyDetails.key,
                            'GET',
                        );
                        filterProduct.then(response => {
                            if (response.status === 'true') {
                                this.setState({
                                    AllProduct: response.Products,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    products: [],
                                    isLoading: false,
                                });
                            }
                        });
                    }
                });
            }


        });
    }    findProducts(searchText) {
        if (searchText === '') {
            return [];
        } else {
            const { AllProduct } = this.state;
            const regex = new RegExp(`${searchText}`, 'i');
            if (AllProduct && AllProduct.length > 0) {
                var filter = AllProduct.filter((e) =>
                    e.title.toLowerCase().includes(searchText.toLowerCase())
                );
            }
            return AllProduct ? AllProduct.filter(e => e.title.search(regex) >= 0) : '';
        }

    }
    _navigateToChild = () => {
        if (this.state.searchText.length > 0) {
            const searchData = this.state.AllProduct.filter(
                e => e.title === this.state.searchText,
            );
            if (searchData && searchData.length > 0) {
                this.props.navigation.navigate('ProductDetails', {
                    getProductDetails: searchData,
                    isSearch:true
                });
            }
        }
    };

    render() {
        const { searchText } = this.state;
        const products = this.findProducts(searchText);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        return (
            <View style={AppStyle.searchBarView}>
                <View style={AppStyle.searchButtonView}>
                    <TouchableOpacity style={AppStyle.searchButton} onPress={() => this._navigateToChild()}>
                        <FontAwesome
                            name="search"
                            size={18}
                            style={{ paddingLeft: 20 }}
                            color={Colors.placeholderColor}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <Autocomplete
                        autoCapitalize={'words'}
                        autoCorrect={false}
                        keyExtractor={item => item.id.toString()}
                        style={AppStyle.autoComplete}
                        inputContainerStyle={AppStyle.autoCompleteInput}
                        containerStyle={{}}
                        data={products.length === 1 &&comp(searchText, products[0].title)? []: products}
                        defaultValue={searchText}
                        onChangeText={text =>this.setState({ searchText: text })}
                        placeholder="Search"
                        placeholderTextColor={'#b1b1b1'}
                        renderItem={({ item, i }) => (
                            <TouchableOpacity onPress={() =>this.setState({ searchText: item.title.trim() })}>
                                <Text
                                    style={AppStyle.autoCompleteText}>
                                    {item.title}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        )
    }
}
