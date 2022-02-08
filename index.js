/**
 * @format
 */
import * as React from 'react';
import {AppRegistry,LogBox} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// console.disableYellowBox = true;
LogBox.ignoreAllLogs(true)
  
 

export default function Main() {
    return (
        <App/>
    );
  }

AppRegistry.registerComponent(appName, () => Main);
