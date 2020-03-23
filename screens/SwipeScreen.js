import React from 'react';
import { View, Text } from 'react-native';
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
            lastViewedCardId: 't3_fnebhw',
        };


    }

    UNSAFE_componentWillMount() {
        if(this.state.detailsOfCards.length < 1) {
            let { amountOfCards, lastViewedCardId } = this.state;
            this.updatedetailsOfCards(amountOfCards, lastViewedCardId);
        }
    }

    async updatedetailsOfCards(amountOfCards, lastViewedCardId) {
        let client = new ApolloClient({
            uri: endpointOfAPI
        });
        let results = await this.runApolloQuery(client, amountOfCards, lastViewedCardId)


        this.setState({ detailsOfCards: results.data.reddit.subreddit.hotListings })
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

    render() {
        let { detailsOfCards } = this.state;

        return (
            <View>
                {detailsOfCards.map((detailsOfCard, indexOfThisCard) => {
                    return (
                        <SwipeCard 
                            key= { indexOfThisCard }
                            indexOfThisCard = { indexOfThisCard }
                            cardDetails = { JSON.stringify(detailsOfCard) }
                            likeEvent = { () => {this.likeEvent()} }
                            dislikeEvent = { () => this.dislikeEvent() }
                        />
                    );
                }).reverse()}
            </View>
        );
    }

    likeEvent() {
        console.log('LIKE')
        this.updateCurrentCard()
    }

    dislikeEvent() {
        console.log('DISLIKE')
        this.updateCurrentCard();
    }

    updateCurrentCard() {
        let newCardDetails = this.state.detailsOfCards;

        newCardDetails.shift();

        this.setState({ detailsOfCards: newCardDetails });
    }
}

export default SwipeScreen;