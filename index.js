/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Navigation } from 'react-native-navigation';
import {registerScreens} from './src/Screens/screens';

registerScreens();
Navigation.setDefaultOptions({
        topBar: {
            background: {
                color: '#fca903',
            },
            title: {
                fontSize: 20,
                color: 'white',
                alignment: 'center',
            },
        },
        layout: {
            orientation: ['portrait'],
        },
    });
Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            component: {
                name: 'Login'
            }
        },
    });
});

//AppRegistry.registerComponent(appName, () => App);
