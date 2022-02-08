import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  ImageBackground, StatusBar, AsyncStorage
} from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/Feather';
import { Colors } from "../assets/styles/Colors";

export default class NoConnection extends Component {
  constructor(props) {
    super(props)
    var params = this.props.route.params;
    this.state = {
      isConnected: true,
      isLoggedIn: false
    }
  }

  componentDidMount() {
    this.checkNetwork();
    AsyncStorage.getItem('isLogin', (err, result) => {
      console.log(result, '$prodid');
      this.setState({
        isLoggedIn: result
      })
    })
  }

  checkNetwork() {
    const unsubscribe = NetInfo.addEventListener(state => {
      this.props.navigation.setParams({
        isConnected: this.state.isConnected
      });
      if (!state.isConnected) {
        this.setState({ isConnected: false });
        this.props.navigation.navigate("NoConnection");
      } else {
        this.setState({ isConnected: true });
      }
    });
  }

  checkConnection() {
    NetInfo.fetch().then(data => {
      console.log(data, 'checkConnectiondata');
      if (data.isConnected === true) {
        console.log(this.state.isLoggedIn, 'this.state.isLoggedIn');
        this.props.navigation.push("Dash");
        // if (this.state.isLoggedIn != null) {
        //   this.props.navigation.push("Home");
        // } else {
        //   this.props.navigation.push("Landing");
        // }
      }
    })
  }

  render() {
    return (
      <>
        <StatusBar
          backgroundColor={Colors.mainBackground}
          barStyle="light-content" />
        <View style={styles.offlineContainer}>
          <Icon
            style={styles.noConnectionIcon}
            name="wifi-off"
          />
          <Text style={styles.noConnection}>No Internet Connection</Text>
          <TouchableOpacity onPress={() => this.checkConnection()} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Pls Try Again</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

}

NoConnection.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  offlineContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
  },
  noConnectionIcon: {
    color: Colors.buttonColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    color: Colors.secondaryTextColor,
    fontSize: 30
  },
  noConnection: {
    color: Colors.secondaryTextColor,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 15,
    backgroundColor: Colors.buttonColor,
    paddingRight: 5,
    paddingVertical: 5,
    borderRadius: 3,
    width: 100,
  },
  buttonText: {
    color: Colors.secondaryTextColor,
    textAlign: 'center',
    fontWeight: '700'
  },
});
