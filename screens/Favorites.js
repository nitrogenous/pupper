import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, AsyncStorage, TouchableOpacity } from 'react-native';

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

        this.setState({ favoritedCards: favoritedCards });
    }

    async getDataFromStorage(storageSelector) {
        try {
            let value = await AsyncStorage.getItem(storageSelector);

            return value || '';
        } catch (error) {}
    }


    render() {
        let { favoritedCards } = this.state;

        return (
            <ScrollView >
                {favoritedCards.map((detailsOfItem, indexOfItem) => {
                    return (
                        <View key={indexOfItem}  style={{flexDirection:'row', flexWrap:'wrap'}}>
                            <Text >
                                {detailsOfItem.title}
                            </Text>
                            <TouchableOpacity onPress={() => {this.removeItemFromFavorites(indexOfItem)}}>
                                <Text>
                                    X
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
        );
    }

    removeItemFromFavorites(indexOfItem) {
        let { favoritedCards } = this.state;
        let storageSelector = 'favoriteCards';

        favoritedCards.splice(indexOfItem, 1);

        this.setState({ favoritedCards: favoritedCards });
        this.setDataToStorage(storageSelector, JSON.stringify(favoritedCards));
    }
  
    async setDataToStorage(storageSelector, valueOfStorage) {
        try {
            await AsyncStorage.setItem(storageSelector, valueOfStorage);
        } catch (error) {}
    }
}

export default Favorites;