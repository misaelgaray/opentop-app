import React, {Component} from 'react';
import {Navigation} from 'react-native-navigation';
import {Text, StyleSheet, SafeAreaView, View, TouchableOpacity, Touchable} from 'react-native';
import { ListItem, Avatar, Badge } from 'react-native-elements';
import {connect} from 'react-redux';
import {setTops} from '../store/actions';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Home extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
    }

    componentDidMount() {
        firestore().collection('tops').get().then(snapshot => {
            let topsList = [];
            snapshot.forEach(item => {
                if (item.data()) {
                    topsList.push(item.data());
                }
            });

            if (topsList) {
                this.props.setTops(topsList);
            }
        });
    }

    navigationButtonPressed({buttonId}) {
        if (buttonId === 'Add') {
            Promise.all([
                Icon.getImageSource('arrow-back-ios', 30),
                Icon.getImageSource('save', 30),
            ]).then(data => {
                Navigation.showModal({
                    stack: {
                        children: [
                            {
                                component: {
                                    name: 'CreateTop',
                                    passProps: {
                                        tops: this.props.tops || [],
                                    },
                                    options: {
                                        topBar: {
                                            title: {
                                                text: 'New Top',
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

    handleTopSelected = (top) => {
        Promise.all([
            Icon.getImageSource('arrow-back-ios', 30),
            Icon.getImageSource('add', 30),
        ]).then(data => {
            Navigation.push(this.props.componentId,{
            component: {
                name: 'Top',
                passProps: { top },
                options: {
                    topBar: {
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
                                id: 'Add',
                                icon: data[1],
                                color: 'white',
                                disabledColor: 'gray',
                            },
                        ], 
                        title: {
                            text: top.name,
                        },
                    },
                },
            },
            });
        });                                   
    };

    getFirstPlace = (top) => {
        if (top.positions && top.positions.length) {
            const item = top.positions.find(item => item.position === 1);
            if (item) {
                return <View>
                    {
                        item.img ? 
                            <Avatar size="medium" source={{uri: item.img}} rounded/>:
                            <Avatar size="medium" title={item.name[0]} titleStyle={{color: '#fca903'}} rounded containerStyle={{backgroundColor: '#e3e3e3e3'}}/>
                    }
                    <Badge value={item.position} containerStyle={{ position: 'absolute', top: -8, left: -8 }} badgeStyle={{ height: 24, width: 24, borderRadius: 12, backgroundColor: '#fca903'}}/>
                </View>;
            }
        }
        return null;
    };

    render() {
        return <SafeAreaView style={styles.root}> 
          <View style={styles.listContainer}>
            {
              this.props.tops ?
                this.props.tops.map((item,i) => {
                    return  <TouchableOpacity key={i} onPress={() => this.handleTopSelected(item)}>
                          <ListItem bottomDivider>
                            <ListItem.Content>
                              <ListItem.Title>{item.name}</ListItem.Title>
                              <ListItem.Subtitle>{item.description || "No Description"}</ListItem.Subtitle>
                            </ListItem.Content>
                            {this.getFirstPlace(item)}
                          </ListItem>
                      </TouchableOpacity>;
                }) : 
                <Text>Loading</Text>
            }
          </View>
        </SafeAreaView>;
    }
}


Home.options = {
  topBar: {
    title: {
      text: 'Tops',
    }
  }
};

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
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        tops: state.topsReducer && state.topsReducer.tops,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setTops: (tops) => dispatch(setTops(tops)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);