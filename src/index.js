// @Flow

import React from 'react';
import { View } from 'react-native';
import { Router, Stack, Scene, Tabs } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { ApolloProvider } from 'react-apollo';
import client from './graphql';
import Search from './containers/Search';
import User from './containers/User';

const TabIcon = ({ focused, tabBarLabel }) => {
  return (
    <View>
      <Icon
        name={tabBarLabel}
        style={{
          color: focused ? '#333' : '#bebebe',
          fontSize: 28,
        }}
      />
    </View>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <Router>
      <Stack key="root">
        <Tabs
          key="tabbar"
          routeName="tabbar"
          backToInitial
          navigationBar={false}
          hideNavBar
          labelStyle={{ color: '#333', display: 'none' }}
          tabBarPosition="bottom"
          tabs
          animationEnabled
          swipeEnabled
        >
          <Scene
            icon={TabIcon}
            tabBarLabel="md-home"
            component={Search}
            lazy
            hideNavBar
          />
          <Scene
            icon={TabIcon}
            tabBarLabel="md-notifications"
            component={Search}
            lazy
            hideNavBar
          />
          <Scene
            icon={TabIcon}
            tabBarLabel="md-search"
            component={Search}
            lazy
            hideNavBar
          />
          <Scene
            icon={TabIcon}
            tabBarLabel="md-person"
            component={User}
            lazy
            hideNavBar
            initial
          />
        </Tabs>
      </Stack>
    </Router>
  </ApolloProvider>
)
