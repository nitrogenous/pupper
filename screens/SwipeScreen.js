import React from 'react';
import { View, Text } from 'react-native';
import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';
import SwipeCard from '../components/SwipeCard';

const subRedditName = 'darkmeme';
const endpointOfAPI = 'https://www.graphqlhub.com/graphql';

class SwipeScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            amountOfCards: 5,
            detailsOfCards: [],
            lastViewedCardId: 't3_fn5ry6',
        };
        console.log(this.state.detailsOfCards.length )
        if(this.state.detailsOfCards.length < 1) {
            let { amountOfCards, lastViewedCardId } = this.state;
            this.updatedetailsOfCards(amountOfCards, lastViewedCardId);
        }
    }

    UNSAFE_componentWillMount() {
        console.log
    }

    async updatedetailsOfCards(amountOfCards, lastViewedCardId) {
        let client = new ApolloClient({
            uri: endpointOfAPI
        });
        let results = await this.runApolloQuery(client, amountOfCards, lastViewedCardId)

        console.log(typeof results)

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
        console.log('render')
        console.log(detailsOfCards);
        return (
            <View>
                {detailsOfCards.map((detailsOfCard, indexOfThisCard) => {
                    console.log(indexOfThisCard)
                    return (
                        <SwipeCard 
                            key={indexOfThisCard}
                            indexOfThisCard={indexOfThisCard}
                            cardDetails={JSON.stringify(detailsOfCard)}
                            likeEvent={() => {this.likeEvent()}}
                        />
                    );
                }).reverse()}
            {console.log(detailsOfCards)}
            </View>
        );
    }

    likeEvent() {
        let newCardDetails = this.state.detailsOfCards;

        console.log('BEFORE ' );
        console.log( newCardDetails)

        newCardDetails.shift();

        console.log('AFTER ')
        console.log(newCardDetails)


        this.setState({ detailsOfCards: newCardDetails });
    }
}

export default SwipeScreen;