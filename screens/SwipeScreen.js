import * as React from 'react';
import { View, Text } from 'react-native';

export default function SwipeScreen() {

    return (
        <View>
            <Text> Like me! </Text>
        </View>
);
}

SwipeScreen.navigationOptions = {
    header: 'pupper',
};
