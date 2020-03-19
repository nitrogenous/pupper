import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import SwipeScreen from '../screens/SwipeScreen';
import Favorites from '../screens/Favorites';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Swipe';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route), headerStyle: {backgroundColor: '#2C3D63'}, headerTintColor:'#fff'});

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Swipe"
        component={SwipeScreen}
        options={{
          title: 'Swipe',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-paw"/>,
        }}
      />
      <BottomTab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          
          title: 'Favorites',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-heart" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Swipe':
      return 'pupper';
    case 'Favorites':
      return 'Favorites';
  }
}
