import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Animated, PanResponder } from 'react-native';

const SCREEN = Dimensions.get('window');
const SCREEN_SCREEN_WIDTH_2 = SCREEN.width / 2

class SwipeCard extends Component {
    constructor(props) {
        super(props);
        this.cardDetails = JSON.parse(this.props.cardDetails);
        this.cardPosition = new Animated.ValueXY();
    }

    UNSAFE_componentWillMount() {
        this.listenCardMovements();

    }

    listenCardMovements() {
        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (event, gestureState) => true,
            onPanResponderMove: (event, gestureState) => {
                this.cardPosition.setValue({ x: gestureState.dx, y: gestureState.dy })
            },
            onPanResponderRelease: (event, gestureState) => {

            }
        });
    }

    render() {
        let { fullnameId, title, score, url } = this.cardDetails;
        let { indexOfThisCard, indexOfCurrentCard } = this.props;
        let isCurrentCard = indexOfThisCard === indexOfCurrentCard;

        return (
            <Animated.View
                { ...(isCurrentCard && this.PanResponder.panHandlers) }

                style={[
                    (isCurrentCard && this.rotateAndTranslateTheCard()), 
                    styles.wrapperOfCard
                ]}
            >
                <Animated.View 
                    style={[ 
                        styles.choiceWrapper, 
                        { transform: [{ rotate: '-30deg' }], left: 40, opacity: this.opacityOfChoice('LIKE') } 
                    ]} 
                >
                    <Text style={[ styles.choiceText, { borderColor: 'green', color: 'green' }]} >
                        LIKE
                    </Text>
                </Animated.View>

                 <Animated.View style={[ 
                        styles.choiceWrapper, 
                        { transform: [{ rotate: '30deg' }], right: 40, opacity: this.opacityOfChoice('NOPE') } 
                    ]} 
                >
                    <Text style={[ styles.choiceText, { borderColor: 'red', color: 'red' } ]} >
                        NOPE
                    </Text>
                </Animated.View>

                <Text style={{position: 'absolute', bottom: 25, left: 50, color: 'blue', zIndex: isCurrentCard ? 1 : 0}}>{title}</Text>

                <Image 
                    style={styles.imageOfCard} 
                    source={{uri: url}}
                />
            </Animated.View>
        );
    }

    opacityOfChoice(choice) {
        let outputRangeValue = choice === 'LIKE' ? [0, 0, 1] : [1, 0, 0];
        return this.cardPosition.x.interpolate({
            inputRange: [-SCREEN_WIDTH_2, 0, SCREEN_WIDTH_2],
            outputRange: outputRangeValue,
            extropolate: 'clamp'
        })
    }

    rotateAndTranslateTheCard() {
        return {
            transform: [{
                    rotate: this.cardPosition.x.interpolate({
                        inputRange: [-SCREEN_WIDTH_2, 0, SCREEN_WIDTH_2],
                        outputRange: ['-10deg', '0deg', '10deg'],
                        extropolate: 'clamp'
                    })
                },
                ...this.cardPosition.getTranslateTransform()
            ]
        }
    }
}

const styles = StyleSheet.create({
    wrapperOfCard: {
        height: SCREEN.height - 120,
        width: SCREEN.width,
        padding: 20,
        position: 'absolute'
    },
    imageOfCard: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
        borderRadius: 20
    },
    choiceWrapper: {
        position: 'absolute',
        top: 50,
        zIndex: 2
    },
    choiceText: {
        borderWidth: 1,
        fontSize: 32,
        fontWeight: '800',
        padding: 10
    },
});

export default SwipeCard;