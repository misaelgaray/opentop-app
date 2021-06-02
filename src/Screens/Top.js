import React, {Component} from 'react';
import {Navigation} from 'react-native-navigation';
import {Text, StyleSheet, SafeAreaView, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import { ListItem, Avatar, Badge, Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {setTop} from '../store/actions';
import DraggableFlatList from "react-native-draggable-flatlist";
import firestore from '@react-native-firebase/firestore';
import _ from 'lodash';
import { openCreatePosition } from './CreatePosition';

class Top extends Component {

    state = {
        isPositionChanged : false,
        savingPositions : false,
    };

    constructor(props) {
      super(props);
      Navigation.events().bindComponent(this);
    }

    navigationButtonPressed({buttonId}) {
        if (!this.state.isPositionChanged && !this.state.savingPositions) {
            if (buttonId === 'Back') {
                Navigation.pop(this.props.componentId);
            } 
    
            if (buttonId === 'Add') {
                const lastPositionIndex = this.props.positions ? this.props.positions.length  : 0;
                openCreatePosition(this.props.top, this.props.positions, lastPositionIndex, false, null);
            }
        }
    }

    editPosition = (position) => {
        const lastPositionIndex = this.props.positions ? this.props.positions.length  : 0;
        openCreatePosition(this.props.top, this.props.positions, lastPositionIndex, false, position);
    };

    renderTop = (data) => {
      const {item, index, drag, isActive} = data;
      return  <TouchableOpacity onLongPress={drag} onPress={() => this.editPosition(item)}>
                  <ListItem bottomDivider>
                    <View>
                        {
                            item.img ? 
                                <Avatar size="medium" source={{uri: item.img}} rounded/>:
                                <Avatar size="medium" title={item.name[0]} titleStyle={{color: '#fca903'}} rounded containerStyle={{backgroundColor: '#e3e3e3e3'}}/>
                        }
                        <Badge value={item.position} containerStyle={{ position: 'absolute', top: -8, left: -8 }} badgeStyle={{ height: 24, width: 24, borderRadius: 12, backgroundColor: '#fca903'}}/>
                    </View>
                    <ListItem.Content>
                      <ListItem.Title><Text style={styles.itemName}>{item.name}</Text></ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
              </TouchableOpacity>;
    };

    handleDragEnd = (data) => {
        let newTop = {...this.props.top};
        let newPositions = [...data].map((item,i) => {
            item.position = i+1;
            return item;
        });
        newTop.positions = newPositions;
        this.setState({
            isPositionChanged : true,
        }, () => this.props.setTop(newTop));
    };

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

    handleSavePositions = () => {
        if (this.props.top.id) {
            this.setState({
                savingPositions : true,
            }, () => {
                this.savePosition(this.props.top.id, this.props.positions, () => {
                    this.setState({ isPositionChanged : false, savingPositions : false });
                });
            });
        }
    }

    render() {
        const positions = this.props.positions ? this.props.positions.sort((a,b) => a.position - b.position).map(item => ({...item, key: 'item-'+item.position})) : null;
        return <SafeAreaView style={styles.root}> 
          <View style={styles.listContainer}>
            <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>{this.props.top.description}</Text>
            </View>
            { 
              positions ?
                <DraggableFlatList 
                    data = {positions}
                    renderItem={this.renderTop}
                    keyExtractor={(item, index) => `draggable-item-${item.position}`}
                    onDragEnd={({ data }) => this.handleDragEnd(data)}
                /> : 
                <Text>No Items In Top</Text>
            }
            {
                this.state.isPositionChanged ? 
                    <TouchableOpacity style={styles.savePositionsBtn} onPress={this.handleSavePositions} disabled={this.state.savingPositions}>
                        {
                            this.state.savingPositions ?
                                <View>
                                    <Text style={{color: "#fca903"}}>Saving</Text>
                                    <ActivityIndicator size="large" color="#fca903" /> 
                                </View>:
                                <Icon 
                                    name='save'
                                    color='#fca903'
                                    type='material'
                                    reverse
                                    size={32}
                                />
                        }
                    </TouchableOpacity> : null
            }
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
    itemName : {
        fontSize: 18,
        fontFamily: 'Roboto',
    },
    savePositionsBtn : {
        position: 'absolute',
        right : 20,
        bottom: 20,
    }
});

const mapDispatchToProps = dispatch => {
    return {
        setTop: (top) => dispatch(setTop(top)),
    };
};


const mapStateToProps = (state, ownProps) => {
    let positions = null;
    if (state.topsReducer && state.topsReducer.tops && ownProps.top) {
        const top = state.topsReducer.tops.find(item => item.id === ownProps.top.id);
        console.log(top);
        if (top && top.positions) {
            positions = top.positions;
        }
    }
    return {
        positions: positions,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Top);