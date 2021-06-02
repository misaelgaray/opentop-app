import React, {Component} from 'react';
import {Navigation} from 'react-native-navigation';
import {StyleSheet, SafeAreaView, View, Alert} from 'react-native';
import { Input} from "react-native-elements";
import {connect} from 'react-redux';
import {setTops} from '../store/actions';
import _ from 'lodash';
import uuid from 'react-native-uuid';
import firestore from '@react-native-firebase/firestore';

class CreateTop extends Component {

    state = {
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
        if (this.state.name && this.props.tops) {
            const id = uuid.v4();
            let newTop = {
                id: id,
                name: this.state.name,
                description: this.state.description,
                positions: [],
            };
            const newTops = [...this.props.tops];
            newTops.push(newTop);
            this.saveTop(newTop, () => {
                this.props.setTops(newTops);
                Navigation.dismissModal(this.props.componentId);
            });
        } else {
            Alert.alert("Name Required", "Please introduce a name");
        }
    }

    saveTop(top, callback){
        firestore()
            .collection('tops')
            .doc(top.id)
            .set({
                ...top,
            })
            .then(()=>callback())
            .catch(error => console.log(error));
    }


    render() {
        
        return <SafeAreaView style={styles.root}> 
          <View style={styles.listContainer}>
            <View style={styles.bodyPositionContainer}>
                <Input
                    containerStyle={{ width: '80%', marginTop: 15}}
                    inputContainerStyle={{ borderColor: '#e3e3e3e3'}}
                    placeholder='Favorite movies, songs...'
                    value={this.state.name}
                    onChangeText={values => this.setState({name: values})}
                    label='Top Name *'
                    leftIcon={{ type: 'material', name: 'star', color: '#e3e3e3e3' }} />
                <Input
                    containerStyle={{ width: '80%', marginTop: 15}}
                    inputContainerStyle={{ borderColor: '#e3e3e3e3'}}
                    placeholder="It's about my favorite songs"
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
        setTops: (tops) => dispatch(setTops(tops)),
    };
};

export default connect(null, mapDispatchToProps)(CreateTop);