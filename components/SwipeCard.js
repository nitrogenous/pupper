import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Animated, PanResponder } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class SwipeCard extends Component {
    constructor(props) {
        super(props);
        this.cardDetails = JSON.parse(this.props.cardDetails);
        this.position = new Animated.ValueXY();
    }

    UNSAFE_componentWillMount() {
        this.listenCardMovements();
    }

    listenCardMovements() {
        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (event, gestureState) => true,
            onPanResponderMove: (event, gestureState) => {
                this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
            },
            onPanResponderRelease: (event, gestureState) => {

            }
        });
    };

    render() {
        let { fullnameId, title, score, url } = this.cardDetails;
        let { indexOfThisCard, indexOfCurrentCard } = this.props;
        let isCurrentCard = indexOfThisCard === indexOfCurrentCard;

        return (
            <Animated.View
                { ...(isCurrentCard && this.PanResponder.panHandlers) }
                style={[
                    isCurrentCard && {transform: this.position.getTranslateTransform()} , 
                    styles.wrapperOfCard
                ]}
            >
                <Text>{title}</Text>
                <Image 
                    style={styles.imageOfCard} 
                    source={{uri: url}}
                />
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    wrapperOfCard: {
        height: SCREEN_HEIGHT - 120,
        width: SCREEN_WIDTH,
        padding: 20,
        position: 'absolute'
    },
    imageOfCard: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
        borderRadius: 20
    }
});

export default SwipeCard;