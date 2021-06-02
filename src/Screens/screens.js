import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import Login from './Login';
import Home from './Home';
import Top from './Top';
import store from '../store';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import CreatePosition from './CreatePosition';
import CreateTop from './CreateTop';

export function registerScreens() {
    Navigation.registerComponentWithRedux('Login', () => gestureHandlerRootHOC(Login), Provider, store);
    Navigation.registerComponentWithRedux('Home', () => gestureHandlerRootHOC(Home), Provider, store);
    Navigation.registerComponentWithRedux('Top', () => gestureHandlerRootHOC(Top), Provider, store);
    Navigation.registerComponentWithRedux('CreatePosition', () => gestureHandlerRootHOC(CreatePosition), Provider, store);
    Navigation.registerComponentWithRedux('CreateTop', () => gestureHandlerRootHOC(CreateTop), Provider, store);
}