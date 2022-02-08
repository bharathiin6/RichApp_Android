import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {AppStyle} from '../assets/styles/AppStyle';
import {SelectedSubStyle} from '../assets/styles/SelectedSubStyle';
import {SettingStyle} from '../assets/styles/SettingStyle';
import {Styles} from '../auth/Styles';
import Icon from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors} from '../assets/styles/Colors';
import Header from '../components/Header';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SecondaryHeader from '../components/SecondaryHeader';
const {width, height} = Dimensions.get('screen');

var subscriptionInfo = [
  {
    id: 1,
    subName: 'One Time',
    subPay: '2,99',
  },
  {
    id: 2,
    subName: 'Month Subscription',
    subPay: '9,99',
  },
  {
    id: 3,
    subName: 'Two Weeks Subscriptions ',
    subPay: '4,99',
  },
  {
    id: 3,
    subName: 'Year Subscriptions ',
    subPay: '19,99',
  },
];

var decription =
  'Rather than selling products individually, a subscription offers periodic (monthly, yearly, or seasonal) use or access to a product or service, or, in the case of performance-oriented organizations such as opera companies, tickets to the entire run of some set number of (e.g., five to fifteen) scheduled performances for an entire season.';
function SelectedSubscription(props) {
  const getData = props.route.params.getData;
  const [subscriptionDetails, setSubscriptionDetails] = useState([]);
  const [getSubscription, setGetSubscription] = useState([getData]);

  useEffect(() => {
    setSubscriptionDetails(subscriptionInfo);
  });

  const _renderSectorItem = (item) => {
    return (
      <Animatable.View
        animation="zoomIn"
        duration={1200}
        style={SelectedSubStyle.animateView}>
        <View style={SelectedSubStyle.animationText}>
          <Text style={[SelectedSubStyle.contentAnimateView]}>
            {item.subName}
          </Text>
          <Text style={SelectedSubStyle.borderText}></Text>
          <Text style={[SelectedSubStyle.contentSubpayText]}>
            <Text style={{fontSize: 12, fontWeight: '500'}}>
              Amount Payable {'\n'}
            </Text>
            {'\u0024'}
            {item.subPay}
          </Text>
        </View>
      </Animatable.View>
    );
  };

  return (
    <>
      <StatusBar
        backgroundColor={Colors.mainBackground}
        barStyle="light-content"
      />
      <SafeAreaView backgroundColor={Colors.mainBackground} style={AppStyle.barStyle}>
        <SecondaryHeader
          navigation={props.navigation}
          title={'Selected Subscription'}
          isLoggedin={false}
        />
        <ScrollView
          style={{
            backgroundColor: Colors.lightWhiteColor,
            height: height - 150,
          }}
          contentInsetAdjustmentBehavior="automatic">
          <View style={{marginTop: height / 4}}>
            <Text
              style={{textAlign: 'center', fontWeight: 'bold', fontSize: 22}}>
              PriceDetails
            </Text>
          </View>
          {getSubscription && getSubscription.length > 0 && (
            <FlatList
              style={{top: 30, paddingHorizontal: 30}}
              keyExtractor={(item, index) => item.id}
              renderItem={({item}) => _renderSectorItem(item)}
              data={getSubscription}
            />
          )}
          <View style={{paddingBottom: 20}}></View>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('Home');
            }}
            style={SelectedSubStyle.logoutButton}>
            <Text style={SettingStyle.logOutText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

export default SelectedSubscription;
