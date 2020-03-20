import React, { Component } from 'react';
import { View, Text, Image, Dimensions, Animated, PanResponder } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class SwipeCard extends Component {
    constructor(props) {
        super(props);
        this.cardDetails = JSON.parse(this.props.cardDetails);
        this.position = new Animated.ValueXY();
    }

    componentWillMount() {
        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (event, gestureState) => true,
            onPanResponderMove: (event, gestureState) => {
                this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
            },
            onPanResponderRelease: (event, gestureState) => {

            }
        });
    }

    render() {
        return (
            <Animated.View {...this.PanResponder.panHandlers} style={[{transform: this.position.getTranslateTransform() },{ height: SCREEN_HEIGHT-120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]} >
                <Text>{this.cardDetails.title}</Text>
                <Image style={{ flex: 1, width: null, height: null, resizeMode: 'cover', borderRadius: 20 }} source={{uri: this.cardDetails.url}}/>
            </Animated.View>
        );
    }
}

export default SwipeCard;