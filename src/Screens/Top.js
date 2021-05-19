import React, {Component} from 'react';
import {Navigation} from 'react-native-navigation';
import {Text, StyleSheet, SafeAreaView, View, TouchableOpacity, Touchable} from 'react-native';
import { ListItem, Avatar, Badge } from 'react-native-elements';
import {connect} from 'react-redux';
import {setTop} from '../store/actions';
import DraggableFlatList from "react-native-draggable-flatlist";
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';

class Top extends Component {

    constructor(props) {
      super(props);
      Navigation.events().bindComponent(this);
    }

    navigationButtonPressed({buttonId}) {
        if (buttonId === 'Back') {
            Navigation.pop(this.props.componentId);
        } 

        if (buttonId === 'Add') {
            const lastPositionIndex = this.props.positions ? this.props.positions.length  : 0;
            Promise.all([
                Icon.getImageSource('arrow-back-ios', 30),
                Icon.getImageSource('save', 30),
            ]).then(data => {
                Navigation.showModal({
                    stack: {
                        children: [
                            {
                                component: {
                                    name: 'CreatePosition',
                                    passProps: {
                                        lastPositionIndex : lastPositionIndex,
                                        top : this.props.top,
                                        positions : this.props.positions,
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
        }
    }

    renderTop = (data) => {
      const {item, index, drag, isActive} = data;
      return  <TouchableOpacity onLongPress={drag}>
                  <ListItem bottomDivider>
                    <View>
                        {
                            item.img ? 
                                <Avatar size="medium" source={{uri: item.img}} rounded/>:
                                <Avatar size="medium" title={item.name[0]} rounded/>
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
        this.props.setTop(newTop);
    };

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