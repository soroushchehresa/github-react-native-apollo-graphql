// @Flow

import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import {
  Container,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
  Spinner,
  Input,
  Item,
  Form,
} from 'native-base';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import * as Animatable from 'react-native-animatable';

const styles = StyleSheet.create({
  container: {},
  listWrapper: {},
  image: {
    width: Dimensions.get('window').width,
    alignSelf: 'stretch',
    resizeMode: 'cover',
    height: 150,
  },
  fixedHeader: {
    backgroundColor: '#eee',
    height: 85,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    opacity: 0,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
  },
  result: {
    fontSize: 18,
    marginVertical: 10,
    marginHorizontal: 20,
    color: '#666',
  },
  loading: {},
  avatar: {
    backgroundColor: '#eee',
  },
  searchInputWrapper: {
    width: '90%',
    marginTop: 80,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    fontSize: 15,
    textAlign: 'center',
  },
  searchButton: {
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  searchButtonText: {
    fontSize: 15,
  },
});

const SEARCH_REPO = gql`
  query Search($query: String!) {
    search(query: $query, type: REPOSITORY, first: 20) {
      edges {
        node {
          ... on Repository {
            id
            name
            description
            owner {
              avatarUrl
            }
          }
        }
      }
    }
  }
`;

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      skipSearch: true,
    };
    this.searchTimeout = null;
  }

  handleChangeSearchInput(value, refetch) {
    this.setState({ skipSearch: true, searchQuery: value });

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.setState({ skipSearch: false }, () => {
        refetch();
      });
    }, 500);
  }

  render() {
    const { searchQuery, skipSearch } = this.state;
    return (
      <Query
        query={SEARCH_REPO}
        variables={{ query: searchQuery }}
        skip={skipSearch}
      >
        {({ loading, error, data, refetch }) => (
          <Container style={styles.container}>
            <HeaderImageScrollView
              useNativeDriver
              fadeOutForeground
              bounces={false}
              overlayColor={'#eee'}
              maxOverlayOpacity={1}
              minOverlayOpacity={0}
              maxHeight={150}
              minHeight={85}
              renderFixedForeground={() => (
                <Animatable.View
                  style={styles.fixedHeader}
                  ref={navTitleView => {
                    this.navTitleView = navTitleView;
                  }}
                  useNativeDriver
                >
                  {
                    (!loading && data && data.search) && searchQuery.length > 0 &&
                    <Text style={styles.headerTitle}>{`Results of search "${searchQuery}"`}</Text>
                  }
                </Animatable.View>
              )}
              renderForeground={() => (
                <Animatable.View
                  ref={navTitleVieww => {
                    this.navTitleVieww = navTitleVieww;
                  }}
                  useNativeDriver
                >
                  <Form>
                    <Item style={styles.searchInputWrapper} rounded>
                      <Input
                        placeholder="Repository name..."
                        style={styles.searchInput}
                        onChangeText={(value) => this.handleChangeSearchInput(value, refetch)}
                        value={searchQuery}
                        autoCorrect={false}
                        autoCapitalize="none"
                      />
                    </Item>
                  </Form>
                </Animatable.View>
              )}
            >
              <TriggeringView
                disableHeaderGrow={loading || !data || data.search.edges.length === 0}
                onHide={() => {
                  this.navTitleVieww.fadeOutUp(200);
                  this.navTitleView.fadeInUp(200);
                }}
                onDisplay={() => {
                  this.navTitleVieww.fadeInDown(200);
                  this.navTitleView.fadeOutDown(200);
                }}
              >
                {
                  (!loading && data && data.search) && searchQuery.length > 0 &&
                  <Text style={styles.result}>{`Results of search "${searchQuery}"`}</Text>
                }
              </TriggeringView>
              <Content>
                {loading && <Spinner color="#333" size="small" style={styles.loading} />}
                <List style={styles.listWrapper}>
                  {
                    (!loading && data && data.search) &&
                    data.search.edges.map(({ node: repo }) => (
                      <ListItem key={repo.id} thumbnail>
                        <Left>
                          <Thumbnail source={{ uri: repo.owner.avatarUrl }} style={styles.avatar} square />
                        </Left>
                        <Body>
                          <Text>{repo.name}</Text>
                          <Text note numberOfLines={1}>{repo.description}</Text>
                        </Body>
                        <Right>
                          <Button transparent>
                            <Text>View</Text>
                          </Button>
                        </Right>
                      </ListItem>
                    ))
                  }
                </List>
              </Content>
            </HeaderImageScrollView>
          </Container>
        )}
      </Query>
    );
  }
}
