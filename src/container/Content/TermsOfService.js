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
    Picker, ActivityIndicator, Alert, StyleSheet, BackHandler
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
import { AboutUrl, LogoutUrl } from '../../HelperApi/Api/APIConfig';
import { HttpHelper, HttpMultiPartHelper } from '../../HelperApi/Api/HTTPHelper';
import DropdownAlert from 'react-native-dropdownalert';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
const { width, height } = Dimensions.get('screen');
import HTMLView from 'react-native-htmlview';
import messaging from '@react-native-firebase/messaging';

class TermsOfService extends Component {
    constructor(props) {
        super(props);
        var params = this.props.route.params;
        this.state = {
            htmlCode: [],
            isTerm: params && params.isTerm ? params.isTerm : false,
            htmlCodePrivacy: [],
            htmlCodeTerms: [],
            isHome: params && params.isHome ? params.isHome : false,
            isLanding: params && params.isLanding ? params.isLanding : false,
            isSetting: params && params.isSetting ? params.isSetting : false
        }
    }

    getDetails = () => {
        AsyncStorage.getItem('accessKey', (err, accessKeyDetails) => {
            if (accessKeyDetails != null) {
                this.setState({
                    accessKeyDetails: JSON.parse(accessKeyDetails),
                    isLoading: true,
                }, () => {
                    let aboutDetails = HttpHelper(
                        AboutUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key, 'GET');
                    aboutDetails.then((response) => {
                        this.setState({
                            isLoading: true,
                            htmlCodeTerms: response.pages[0].terms,
                            htmlCodePrivacy: response.pages[0].faq
                        })
                    })
                });
            }
        })
    }
    componentDidMount() {
        this.setState({ isLoading: true }, () => {
            this.getDetails();
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

        })
    }
    handleBackPress = () => {
        if (this.state.isSetting) {
            this.props.navigation.navigate('Settings');
        } else if (this.state.isLanding) {
            this.props.navigation.navigate('Landing');
        } else {
            this.props.navigation.navigate('Home');
        }
        return true;
    };
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.route.params) {
            this.setState({
                isTerm: nextProps.route.params.isTerm ? nextProps.route.params.isTerm : false,
                isLanding: nextProps.route.params.isLanding ? nextProps.route.params.isLanding : false,
                isSetting: nextProps.route.params && nextProps.route.params.isSetting ? nextProps.route.params.isSetting : false
            }, () => {
                this.getDetails();
                this.forceUpdate()
            })
        }
    }
    navigateToChild = async () => {
        if (this.state.isLanding) {
            const fcmToken = await messaging().getToken();
            if (this.state.accessKeyDetails && this.state.accessKeyDetails != null) {
                let logOut = HttpHelper(LogoutUrl + 'accesskey' + '=' + this.state.accessKeyDetails.key + '&' + 'fcmkey' + '=' + fcmToken, 'GET');
                logOut.then(response => {
                    if (response && response.status === "true") {
                        try {
                            AsyncStorage.removeItem('user', (err) => {
                                AsyncStorage.removeItem('accesskey', (err) => {
                                    AsyncStorage.removeItem('notificationDetails', (err) => {
                                        this.props.navigation.push('Landing');
                                    });
                                });
                            });
                        } catch (error) { }
                    }
                })
            }
        } else {
            if (this.state.isSetting) {
                this.props.navigation.navigate('Settings');
            } else {
                this.props.navigation.navigate('Home');
            }
        }
    }
    render() {
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
                                onPress={() => this.navigateToChild()}>
                                <AntDesign
                                    style={{ height: 30, alignSelf: 'center' }}
                                    name="arrowleft"
                                    color={Colors.lightWhiteColor}
                                    size={30}
                                />
                            </TouchableOpacity>
                            <Text numberOfLines={1} style={AppStyle.secondaryHeaderTitle}>{this.state.isTerm ? 'Terms of Services' : 'Privacy Policy'}</Text>
                            <TouchableOpacity style={{ width: 40 }}></TouchableOpacity>

                        </View>
                    </View>
                    {this.state.isTerm ?
                        <View style={{ height: height - 80 }}>
                            <ScrollView style={{
                                paddingHorizontal: 15,
                                backgroundColor: Colors.White
                            }}>
                                {this.state.htmlCodeTerms &&
                                    <View style={{}}>
                                        <HTMLView
                                            value={this.state.htmlCodeTerms}
                                            stylesheet={styless}
                                            addLineBreaks={false}
                                        />
                                    </View>
                                }
                            </ScrollView>
                        </View> :
                        <View style={{ height: height - 80 }}>
                            <ScrollView style={{
                                paddingHorizontal: 15,
                                backgroundColor: Colors.White
                            }}>
                                {this.state.htmlCodePrivacy &&
                                    <>
                                        <View style={{}}>
                                            <HTMLView
                                                value={this.state.htmlCodePrivacy}
                                                stylesheet={styles}
                                                addLineBreaks={false}
                                            />
                                        </View>
                                    </>
                                }
                            </ScrollView>
                        </View>}
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
const styles = StyleSheet.create({
    p: {
        color: Colors.textColor,
        fontSize: 14,
        fontWeight: 'bold',
    },
    title: {
        color: Colors.textColor,
        fontSize: 14,
        fontWeight: 'bold',
    }

});
const styless = StyleSheet.create({
    p: {
        color: Colors.textColor,
        fontSize: 14,
        fontWeight: 'bold',
    },
    title: {
        color: Colors.textColor,
        fontSize: 14,
        fontWeight: 'bold',
    }
});
export default TermsOfService;
