import React from 'react';
import { ScrollView, Text } from 'react-native';
import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';
import SwipeCard from '../components/SwipeCard';

class SwipeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            amountOfCards: 20,
            cards: []
        };

    }

    componentWillMount() {
        this.getCardDetails(this.state.amountOfCards);
    }

    getCardDetails(amountOfCards) {
        let client = new ApolloClient({
            uri: 'https://www.graphqlhub.com/graphql',
        });

        client.query({
            query: gql `{
                reddit {
                    subreddit(name: "darkmeme"){
                        hotListings(limit: ${amountOfCards}) {
                                fullnameId
                                title
                                score
                                url
                            }
                        }
                }
            }`
        }).then((result) => {
            this.setState({
                cards: result.data.reddit.subreddit.hotListings || {}
            })
        })
    }

    render() {
        return (
            <ScrollView>
                {(this.state.cards).map((detailsOfCard, indexOfCard) => {
                    return (
                        <SwipeCard key={indexOfCard} cardDetails={JSON.stringify(detailsOfCard)} />
                    );
                })}

                <Text>Like me!</Text>
            </ScrollView>
        );
    }
}

export default SwipeScreen;