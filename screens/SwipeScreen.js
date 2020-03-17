import * as React from 'react';
import { View, Text } from 'react-native';
import ApolloClient from 'apollo-boost';
import { gql } from "apollo-boost";

export default function SwipeScreen() {
    const client = new ApolloClient({
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
    }).then(result => console.log(result))


    return (
        <View>
            <Text> Like me! </Text>
        </View>
    );
}

SwipeScreen.navigationOptions = {
    header: 'pupper',
};
