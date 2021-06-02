import React, {Component} from 'react';
import {Navigation} from 'react-native-navigation';
import {StyleSheet, SafeAreaView, View, Alert} from 'react-native';
import { Avatar, Input, Badge} from "react-native-elements";
import {connect} from 'react-redux';
import {setTop} from '../store/actions';
import _ from 'lodash';
import uuid from 'react-native-uuid';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const openCreatePosition = (top, positions, lastPositionIndex, isEdit, position) => {
    Promise.all([
        MaterialIcon.getImageSource('arrow-back-ios', 30),
        MaterialIcon.getImageSource('save', 30),
    ]).then(data => {
        Navigation.showModal({
            stack: {
                children: [
                    {
                        component: {
                            name: 'CreatePosition',
                            passProps: {
                                lastPositionIndex : lastPositionIndex,
                                top : top,
                                positions : positions,
                                isEdit : isEdit,
                                position: position,
                            },
                            options: {
                                topBar: {
                                    title: {
                                        text: 'New Position',
                                    },
                                    leftButtons: [
                                        {
                                            id: 'Back',
                                            icon: data[0],
                                            color: 'white',
                                            disabledColor: 'gray',
                                        },
                                    ],
                                    rightButtons: [
                                        {
                                            id: 'Save',
                                            icon: data[1],
                                            color: 'white',
                                            disabledColor: 'gray',
                                        },
                                    ], 
                                },
                            },
                        },
                    },
                ],
            },
        });
    });
};

class CreatePosition extends Component {

    state = {
        image : null,
        imageName : null,
        name: null,
        description: '',
    }

    constructor(props) {
      super(props);
      Navigation.events().bindComponent(this);
    }

    navigationButtonPressed({buttonId}) {
        if (buttonId === 'Back') {
            Navigation.dismissModal(this.props.componentId);
        } 

        if (buttonId === 'Save') {
            this.handleSavePosition();
        }
    }

    handleSavePosition() {
        if (this.state.name && this.props.positions) {
            const id = uuid.v4();
            let newPosition = {
                name: this.state.name,
                description: this.state.description,
                position: this.props.lastPositionIndex + 1,
            };

            let newPositions = [...this.props.positions];
            newPositions.push(newPosition);

            let newTop = {...this.props.top};
            newTop.positions = newPositions;

            if (this.state.image) {
                const storeRef = storage().ref(this.state.imageName);
                storeRef.putFile(this.state.image).then(response => {
                    storeRef.getDownloadURL().then(url => {
                        newPosition.img = url;
                        this.savePosition(this.props.top.id, newPositions, () => {
                            this.props.setTop(newTop);
                            Navigation.dismissModal(this.props.componentId);
                        });
                    });
                });
            } else {
                this.savePosition(this.props.top.id, newPositions, () => {
                    this.props.setTop(newTop);
                    Navigation.dismissModal(this.props.componentId);
                });
            }
        } else {
            Alert.alert("Name Required", "Please introduce a name");
        }
    }

    savePosition(topId, positions, callback){
        firestore()
            .collection('tops')
            .doc(topId)
            .update({
                positions : positions
            })
            .then(()=>callback())
            .catch(error => console.log(error));
    }

    handleSavePhoto = () => {
        launchImageLibrary({
            mediaType: 'photo',
        }, (response) => {
            this.setState({
                image : response.uri,
                imageName: response.fileName,
            });
        });
    };

    render() {
        
        return <SafeAreaView style={styles.root}> 
          <View style={styles.listContainer}>
            <View style={styles.bodyPositionContainer}>
                <View>
                    <Avatar
                        size="xlarge"
                        rounded
                        source={this.state.image ? {uri: this.state.image} : null}
                        icon={{name: 'add-photo-alternate', color: '#fca903', type: 'material'}}
                        overlayContainerStyle={{backgroundColor: '#e3e3e3e3'}}
                        onPress={this.handleSavePhoto}
                        activeOpacity={0.7}
                    />
                    <Badge value={this.props.lastPositionIndex + 1} containerStyle={{ position: 'absolute', top: 4, left: 10 }} badgeStyle={{ height: 30, width: 30, borderRadius: 15, backgroundColor: '#fca903'}}/>
                </View>
                <Input
                    containerStyle={{ width: '80%', marginTop: 15}}
                    inputContainerStyle={{ borderColor: '#e3e3e3e3'}}
                    placeholder='Artist, Song, Movie...'
                    value={this.state.name}
                    onChangeText={values => this.setState({name: values})}
                    label='Who/What is in this position? *'
                    leftIcon={{ type: 'material', name: 'star', color: '#e3e3e3e3' }} />
                <Input
                    containerStyle={{ width: '80%', marginTop: 15}}
                    inputContainerStyle={{ borderColor: '#e3e3e3e3'}}
                    placeholder="Why it's in this position?"
                    value={this.state.description}
                    onChangeText={values => this.setState({description: values})}
                    label='Description (Optional)'
                    leftIcon={{ type: 'material', name: 'star', color: '#e3e3e3e3' }} />
            </View>
          </View>
        </SafeAreaView>;
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer : {
      flex: 1,
      width: '100%',
      height: '100%',
      padding: 15,
    },
    descriptionContainer : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding : 10
    },
    descriptionText: {
        fontSize: 14
    },
    bodyPositionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const mapDispatchToProps = dispatch => {
    return {
        setTop: (top) => dispatch(setTop(top)),
    };
};

export default connect(null, mapDispatchToProps)(CreatePosition);