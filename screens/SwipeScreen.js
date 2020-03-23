import React from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';
import SwipeCard from '../components/SwipeCard';

const subRedditName = 'aww';
const endpointOfAPI = 'https://www.graphqlhub.com/graphql';

class SwipeScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            amountOfCards: 10,
            detailsOfCards: [],
            lastViewedCardId: '',
        };
    }

    UNSAFE_componentWillMount() {
        this.updateDetailsOfCards();
    }

    async updateDetailsOfCards(lastViewedCardId = '') {
        this.setState({ lastViewedCardId: lastViewedCardId });

        if (this.state.detailsOfCards.length < 3) {
            let { amountOfCards, lastViewedCardId } = this.state;
            let cardDetails = await this.getCardsFromAPI(amountOfCards, lastViewedCardId);

            this.setState({ detailsOfCards: cardDetails })
        }
    }

    async getCardsFromAPI(amountOfCards, lastViewedCardId) {
        let client = new ApolloClient({
            uri: endpointOfAPI
        });
        let queryResults = await this.runApolloQuery(client, amountOfCards, lastViewedCardId)
        let cardDetails = queryResults.data.reddit.subreddit.hotListings

        cardDetails = this.checkCardUrlsAreValid(cardDetails);

        return cardDetails || [];
    }

    async runApolloQuery(client, amountOfCards, lastViewedCardId) {
        return await client.query({
            query: gql `{
                reddit {
                    subreddit(name: "${subRedditName}"){
                        hotListings(limit: ${amountOfCards}, after: "${lastViewedCardId}") {
                                fullnameId
                                title
                                score
                                url
                            }
                        }
                }
            }`
        });
    }

    checkCardUrlsAreValid(cards) {
        return cards.filter((card) => {
            return this.isUrlContainImage(card.url)
        });
    }

    isUrlContainImage(url) {
        return !!url.match(/\.(jpeg|jpg|png)$/);
    }


    render() {
        let { detailsOfCards } = this.state;

        return (
            <View>
                {detailsOfCards.map((detailsOfCard, indexOfThisCard) => {
                    return (
                        <SwipeCard 
                            key= { indexOfThisCard }
                            indexOfCard = { indexOfThisCard }
                            cardDetails = { JSON.stringify(detailsOfCard) }
                            cardSwiped = { this.cardSwiped.bind(this) }
                        />
                    );
                }).reverse()}
            </View>
        );
    }

    cardSwiped(indexOfSwipedCard, swipeEvent) {
        if (swipeEvent === 'LIKE') {
            this.addCardToFavorites(indexOfSwipedCard);
        }

        this.updateCurrentCard();
    }

    async addCardToFavorites(indexOfSwipedCard) {
        let storageSelector = 'favoriteCards'
        let favoritedCards = JSON.parse(await this.getDataFromStorage(storageSelector) || '[]');
        let cardDetails = this.state.detailsOfCards[indexOfSwipedCard];

        favoritedCards.unshift(cardDetails);
        this.setDataToStorage(storageSelector, JSON.stringify(favoritedCards));
    }

    async getDataFromStorage(storageSelector) {
        try {
            let value = await AsyncStorage.getItem(storageSelector);

            return value || '';
        } 
        catch (error) {
        }
    }

    async setDataToStorage(storageSelector, valueOfStorage) {
        try {
            await AsyncStorage.setItem(storageSelector, valueOfStorage);
        } 
        catch (error) {
        }
    }

    updateCurrentCard() {
        let newCardDetails = this.state.detailsOfCards;

        newCardDetails.shift();

        this.setState({ detailsOfCards: newCardDetails });
    }
}

export default SwipeScreen;