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
            amountOfCards: 20,
            detailsOfCards: [],
            lastViewedCardId: '',
            indexOfCurrentCard: 0,
        };

    }

    UNSAFE_componentWillMount() {
        let { amountOfCards, lastViewedCardId } = this.state;
        
        console.log(this.state.detailsOfCards.length)

        if(this.state.detailsOfCards.length < 5) {
            this.updatedetailsOfCards(amountOfCards, lastViewedCardId);
        }
    }

    shouldComponentUpdate() {
       console.log(this.state.detailsOfCards.length)
       true;
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
                        hotListings(limit: ${amountOfCards}) {
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
        let { detailsOfCards, indexOfCurrentCard } = this.state;

        return (
            <View>
                {(detailsOfCards).map((detailsOfCard, indexOfThisCard) => {
                    return (
                        <SwipeCard 
                            key={indexOfThisCard}
                            indexOfThisCard={indexOfThisCard}
                            indexOfCurrentCard={indexOfCurrentCard}
                            cardDetails={JSON.stringify(detailsOfCard)}
                            likeEvent={() => {this.likeEvent()}}
                        />
                    );
                }).reverse()}
            </View>
        );
    }

    likeEvent() {
        let newCardDetails = this.state.detailsOfCards;

        console.log(newCardDetails)

        newCardDetails.shift();

        console.log(newCardDetails)

        this.setState({indexOfCurrentCard: this.state.indexOfCurrentCard + 1, detailsOfCards: newCardDetails});
    }
}

export default SwipeScreen;