// @Flow

import { AppRegistry } from 'react-native';
import App from './src/index';
import { name as appName } from './app.json';

// Hide yellow box
console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
