import React, {Component} from 'react';
import {Navigation} from 'react-native-navigation';
import {Text, StyleSheet, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {setUser} from '../store/actions';

class App extends Component {

    componentDidMount() {
        if (!this.props.user) {
            Navigation.push(this.props.componentId, {
                component: {
                    name: 'Home', // Push the screen registered with the 'Settings' key
                    options: { // Optional options object to configure the screen
                        topBar: {
                            title: {
                            text: 'Home' // Set the TopBar title of the new Screen
                            }
                        }
                    }
                }
            });
        } else {
            /*Navigation.push(this.props.componentId, {
                component: {
                    name: 'Login', // Push the screen registered with the 'Settings' key
                    options: { // Optional options object to configure the screen
                        topBar: {
                            background: {
                                color: 'white'
                            }
                        }
                    }
                }
            });*/
            
        }
    }

    render() {
        return <SafeAreaView style={styles.root}>
            <Text>Loading</Text>
        </SafeAreaView>;
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

const mapStateToProps = (state, ownProps) => {
    console.log(state);
    return {
        user: state.userReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setUser: (user) => dispatch(setUser(user)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);