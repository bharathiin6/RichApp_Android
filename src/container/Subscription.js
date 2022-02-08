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
import {SubscriptionStyle} from '../assets/styles/SubscriptionStyle';
import {Styles} from '../auth/Styles';
import Icon from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors} from '../assets/styles/Colors';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CheckBox from 'react-native-check-box';
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
    subName: 'Monthly Subscription',
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
function Subscription({navigation}) {
  const [subscriptionDetails, setSubscriptionDetails] = useState([]);

  useEffect(() => {
    setSubscriptionDetails(subscriptionInfo);
  });

  const _renderSectorItem = (item) => {
    return (
      <Animatable.View
        animation="zoomIn"
        duration={1200}
        style={SubscriptionStyle.animateView}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SelectedSubscription', {getData: item});
          }}>
          <View
            style={
              item.subName === 'One Time'
                ? [
                    SubscriptionStyle.animationText,
                    {borderColor: Colors.buttonColor},
                  ]
                : [
                    SubscriptionStyle.animationText,
                    {borderColor: Colors.textColor},
                  ]
            }>
            <Text
              style={
                item.subName === 'One Time'
                  ? [
                      SubscriptionStyle.contentAnimateView,
                      {color: Colors.buttonColor},
                    ]
                  : [
                      SubscriptionStyle.contentAnimateView,
                      {color: Colors.textColor},
                    ]
              }>
              {item.subName}
            </Text>
            <Text
              style={
                item.subName === 'One Time'
                  ? [
                      SubscriptionStyle.contentSubpayText,
                      {color: Colors.buttonColor},
                    ]
                  : [
                      SubscriptionStyle.contentSubpayText,
                      {color: Colors.textColor},
                    ]
              }>
              {item.subPay}
              {'\u0024'}
            </Text>
          </View>
        </TouchableOpacity>
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
          navigation={navigation}
          title={'Subscription'}
          isLoggedin={false}
        />
        <ScrollView
          style={{
            backgroundColor: Colors.lightWhiteColor,
            height: height - 150,
          }}
          contentInsetAdjustmentBehavior="automatic">
          {subscriptionDetails && subscriptionDetails.length > 0 && (
            <FlatList
              style={{top: 30, paddingHorizontal: 30}}
              keyExtractor={(item, index) => item.id}
              renderItem={({item}) => _renderSectorItem(item)}
              data={subscriptionDetails}
            />
          )}
          <View style={{padding: 20, paddingBottom: 20}}>
            <Text style={[AppStyle.titleContent, SubscriptionStyle.desText]}>
              Description
            </Text>
            <Text style={SubscriptionStyle.descriprionText}>{decription}</Text>
            <Text
              style={[AppStyle.titleContent, {padding: 15, fontWeight: '700'}]}>
              Terms and Conditions
            </Text>
            <Text style={SubscriptionStyle.descriprionText}>{decription}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

export default Subscription;
