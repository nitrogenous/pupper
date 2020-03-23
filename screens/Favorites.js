import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

class Favorites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            favoritedCards: []
        };

    }

    UNSAFE_componentWillMount() {
        this.getFavoritedCards();

    };

    async getFavoritedCards() {
        let storageSelector = 'favoriteCards';
        let favoritedCards = JSON.parse(await this.getDataFromStorage(storageSelector) || '[]');
        console.log(favoritedCards);
        this.setState({ favoritedCards: favoritedCards });
    }

    async getDataFromStorage(storageSelector) {
        try {
            let value = await AsyncStorage.getItem(storageSelector);
            console.log(value)
            return value || '';
        } catch (error) {}
    }

    async setDataToStorage(storageSelector, valueOfStorage) {
        try {
            await AsyncStorage.setItem(storageSelector, valueOfStorage);
        } catch (error) {}
    }

    render() {
        return (
            <View style={{ 
             flex: 1,
             alignItems:'center',
             justifyContent:'center'
            }}>
            <FlatList
                data={this.state.favoritedCards}
                renderItem={({item}) => <Text>{item.title}</Text>}
            />

            </View>
        );
    }
}

export default Favorites;