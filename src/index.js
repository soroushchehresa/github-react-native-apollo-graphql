// @Flow

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Router, Stack, Scene } from 'react-native-router-flux';
import Home from './containers/Home';

export default () => (
  <Router>
    <Stack key="root">
      <Scene key="home" component={Home} title="Home" />
    </Stack>
  </Router>
)
