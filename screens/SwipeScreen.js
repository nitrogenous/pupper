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
            amountOfCards: 5,
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
        return !!url.match(/\.(jpeg|jpg|gif|png|gfycat|imgur)$/);
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
        if(swipeEvent === 'LIKE') {

        }

        this.updateCurrentCard();
    }


    updateCurrentCard() {
        let newCardDetails = this.state.detailsOfCards;

        newCardDetails.shift();

        this.setState({ detailsOfCards: newCardDetails });
    }
}

export default SwipeScreen;