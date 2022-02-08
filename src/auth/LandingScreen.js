import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    ImageBackground, Alert,
    TextInput, ActivityIndicator, Dimensions, BackHandler
} from 'react-native';
import { AppStyle } from '../assets/styles/AppStyle';
import { Styles } from './Styles';
import Icon from 'react-native-vector-icons/EvilIcons';
import { Colors } from '../assets/styles/Colors';
import * as Animatable from 'react-native-animatable';
import { AccessUrl, LoginUrl } from '../HelperApi/Api/APIConfig';
import { HttpHelper } from '../HelperApi/Api/HTTPHelper';
import DropdownAlert from 'react-native-dropdownalert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
const { width, height } = Dimensions.get("window");



class Landing extends Component {
    constructor(props) {
        super(props);
        var params = this.props.route.params;
        this.state = {
            currentPage: this.props.route ? this.props.route.name : '',

            isBackHandler: params && params.isBackHandler ? params.isBackHandler : false
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
    handleBackPress = () => {
        Alert.alert(
            'Exit App',
            'Are you want to Exiting the application?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => BackHandler.exitApp()
            },], {
            cancelable: false
        }
        )
        return true;
    }


    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
    componentWillReceiveProps(nextProps) {
    }
    render() {
        return (
            <>
                <StatusBar
                    backgroundColor={Colors.mainBackground}
                    barStyle="light-content"
                />

                <ImageBackground
                    resizeMode="cover"
                    source={require('../assets/images/bg.png')}
                    style={Styles.imageBg}>
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                        <SafeAreaView>
                            <View style={[Styles.loginContainer, { marginTop: height / 6 }]}>
                                <Animatable.Image
                                    animation="bounceIn"
                                    duration={1500}
                                    style={AppStyle.logoImage}
                                    source={require('../assets/images/logo.png')}
                                />
                                <View style={[AppStyle.container, { marginTop: 20 }]}>
                                    <TouchableOpacity onPress={() => this.props.navigation.push('Login')}
                                        style={[AppStyle.landButton]}>
                                        <Text style={AppStyle.buttonText}>Login</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={AppStyle.container}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}
                                        style={AppStyle.landButton}>
                                        <Text style={AppStyle.buttonText}>Register</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={AppStyle.forgetView}>
                                    <MaterialCommunityIcons
                                        name="circle-medium"
                                        size={22}
                                        style={{ top: 5 }}
                                        color={Colors.lightGreyColor}
                                    />
                                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('TermsOfService', { isTerm: false, isLanding: true }); }}>
                                        <Text style={AppStyle.buttonText}>Privacy Policy</Text>
                                    </TouchableOpacity>

                                </View>
                                <View style={AppStyle.forgetView}>
                                    <MaterialCommunityIcons
                                        name="circle-medium"
                                        size={22}
                                        style={{ top: 5 }}
                                        color={Colors.lightGreyColor}
                                    />
                                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('TermsOfService', { isTerm: true, isLanding: true }); }}>

                                        <Text style={AppStyle.buttonText}>Terms of Services</Text>
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
                </ImageBackground>
            </>
        );
    }
}

export default Landing;
