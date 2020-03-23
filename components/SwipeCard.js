import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Animated, PanResponder } from 'react-native';

const SCREEN = Dimensions.get('window');
const SCREEN_WIDTH_2 = SCREEN.width / 2

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
                if (gestureState.dx > 120) {
                    Animated.spring(this.cardPosition, {
                        toValue: { X: SCREEN.width + 200, y: gestureState.dy }
                    }).start(() => {
                        this.props.cardSwiped(this.props.indexOfCard, 'LIKE');
                    })
                } else if (gestureState.dx < -120) {
                    Animated.spring(this.cardPosition, {
                        toValue: { X: SCREEN.width + 200, y: gestureState.dy }
                    }).start(() => {
                        this.props.cardSwiped(this.props.indexOfCard, 'NOPE');
                    })
                } else {
                    Animated.spring(this.cardPosition, {
                        toValue: { x: 0, y: 0 },
                        friction: 4
                    }).start()
                }
            }
        });
    }

    render() {
        let { fullnameId, title, score, url } = this.cardDetails;
        let { indexOfCard } = this.props;
        let isCurrentCard = indexOfCard === 0;

        return (
            <Animated.View
                { ...( isCurrentCard && this.PanResponder.panHandlers ) }

                style={[
                    ( isCurrentCard && this.swipeAnimationOfCard() ), 
                    styles.wrapperOfCard
                ]} >

                <Animated.View 
                    style={[ 
                        styles.choiceWrapper, 
                        { transform: [{ rotate: '-30deg' }], left: 40, opacity: this.opacityOfChoice('LIKE') } 
                    ]} >

                    <Text style={[ styles.choiceText, { borderColor: 'green', color: 'green' }]} >
                        LIKE
                    </Text>
                </Animated.View>

                <Animated.View style={[ 
                        styles.choiceWrapper, 
                        { transform: [{ rotate: '30deg' }], right: 40, opacity: this.opacityOfChoice('NOPE') } 
                    ]} >

                    <Text style={[ styles.choiceText, { borderColor: 'red', color: 'red' } ]} >
                        NOPE
                    </Text>
                </Animated.View>
                
                <View style= {{position: 'absolute', zIndex: -indexOfCard, bottom: 19, left: 20, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, width: SCREEN.width - 40, padding: 20, backgroundColor: 'rgba(0, 0, 0, 0.5)'}} >
                    <Text style = {{ color: 'white' }}>{ title }</Text>
                </View>

                <Image 
                    style={[ styles.imageOfCard, {zIndex: -(indexOfCard + 1)} ]} 
                    source={{uri: url}}
                />
            </Animated.View>
        );
    }

    swipeAnimationOfCard() {
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

    opacityOfChoice(choice) {
        let outputRangeValue = choice === 'LIKE' ? [0, 0, 1] : [1, 0, 0];

        return this.cardPosition.x.interpolate({
            inputRange: [-SCREEN_WIDTH_2, 0, SCREEN_WIDTH_2],
            outputRange: outputRangeValue,
            extropolate: 'clamp'
        })
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