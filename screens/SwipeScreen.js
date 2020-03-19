import React from 'react';
import { View, Text } from 'react-native';
import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';
import SwipeCard from '../components/SwipeCard';

class SwipeScreen extends React.Component {
    static navigationOptions = {
        header: 'pupper',
    };

    constructor(props) {
        super(props);
        this.state = {
            cardValues: []
        };

    }

    componentWillMount() {
        this.graphqlRequest();
    }

    graphqlRequest() {
        console.log(this.state.cardValues)

        let client = new ApolloClient({
            uri: 'https://www.graphqlhub.com/graphql',
        });

        client.query({
            query: gql `{
                reddit {
                    subreddit(name: "darkmeme"){
                        hotListings(limit: 19) {
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
                cardValues: result.data.reddit.subreddit.hotListings || {}
            })
        })
    }

    render() {
        return (
            <View>
                {(this.state.cardValues).map((prop) => {
                    return (
                        <SwipeCard />
                    );
                })}

                <Text> Like me! </Text>
            </View>
        );
    }
}

export default SwipeScreen;