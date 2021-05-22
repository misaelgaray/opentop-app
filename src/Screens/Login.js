import React, {Component} from 'react';
import {Navigation} from 'react-native-navigation';
import { TouchableOpacity, Text, StyleSheet, SafeAreaView, View} from 'react-native';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {setUser} from '../store/actions';
import auth from '@react-native-firebase/auth';
import _ from 'lodash';

class Login extends Component {

    state = {
        email: null,
        password: null,
        isSignUp : false,
    };

    setHomeAsRoot = () => {
        Promise.all([
            Icon.getImageSource('add', 30),
        ]).then(results => {
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
            });
            Navigation.setRoot({
                root: {
                    stack: {
                        children: [
                            {
                                component: {
                                    name: 'Home',
                                    options: {
                                        topBar: {
                                            rightButtons: [
                                                {
                                                    id: 'Add',
                                                    icon: results[0],
                                                    color: 'white',
                                                    disabledColor: 'gray',
                                                },
                                            ], 
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
            });
        });
    };

    componentDidMount(){
        auth().onAuthStateChanged(this.onAuthStateChanged);
        if (this.props.user) {
			setTimeout(() => {
				this.setHomeAsRoot();
			}, 3000);
        }
    }
    
    handleLoginBtn = () => {
        if (this.state.isSignUp) {
            auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(() => {
                    console.log("User Created");
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                    }

                    if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                    }

                    console.error(error);
                });
        } else {
            auth().signInWithEmailAndPassword(this.state.email, this.state.password);
        }
    
    };

    componentDidUpdate(){
        if (this.props.user) {
            this.setHomeAsRoot();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextProps, this.props);
    }

    onAuthStateChanged = (user) => {
        if (user) {
            this.props.setUser(user);
        } else {
            this.props.setUser(null);
        }
    };

    render(){
        return !this.props.user ?
			<SafeAreaView style={styles.root}>
				<Text style={styles.titleText}>OPEN TOP</Text>
				<Input
					containerStyle={{ width: '80%'}}
					inputContainerStyle={{ borderColor: '#e3e3e3e3'}}
					placeholder='example_08'
					value={this.state.email}
					onChangeText={values => this.setState({email: values})}
					label='Your username'
					leftIcon={{ type: 'material', name: 'account-circle', color: '#e3e3e3e3' }} />
				<Input
					containerStyle={{ width: '80%'}}
					inputContainerStyle={{ borderColor: '#e3e3e3e3'}}
					placeholder='Password'
					label='Password'
					value={this.state.password}
					onChangeText={values => this.setState({password: values})}
					leftIcon={{ type: 'material', name: 'lock', color: '#e3e3e3e3' }} 
					secureTextEntry />
				<TouchableOpacity style={styles.buttonLogin} onPress={this.handleLoginBtn} disabled={!this.state.email || !this.state.password}>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>
			</SafeAreaView> : 
			<View style={styles.splashContainer}>
				<Text style={styles.splashTitle}>OPEN TOP</Text>
			</View>;
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        width: '80%',
    },
    titleText: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20
    },    
    loginInput : {
        borderWidth: 2,
        borderColor: '#e3e3e3e3',
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 10,
        width: '80%',
    },
    buttonLogin : {
        marginTop: 10,
        width: '80%',
        backgroundColor: '#fca903',
        padding: 10,
        borderRadius: 10,
    },
    buttonText : {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
	splashContainer : {
		backgroundColor: '#fca903',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	splashTitle : {
		color: 'white',
		fontSize: 28,
		fontWeight: 'bold',
		fontFamily: 'Roboto'
	}
});

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.userReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setUser: (user) => dispatch(setUser(user)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);