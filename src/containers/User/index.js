// @Flow

import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import {
  Container,
  Content,
  Text,
  Thumbnail,
  Title,
  Subtitle,
  View,
} from 'native-base';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

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

const GET_USER = gql`
  query User($username: String!) {
    user(login: $username) {
      avatarUrl
      bio
      company
      email
      name
      location
      login
      websiteUrl
      followers {
        totalCount
      }
      following {
        totalCount
      }
      starredRepositories {
        totalCount
      }
      repositories {
        totalCount
      }
      organizations(last: 10) {
        nodes {
          name
        }
      }
    }
  }
`;

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Query
        query={GET_USER}
        variables={{ username: 'soroushchehresa' }}
      >
        {({ loading, error, data, refetch }) => (
          <Container style={styles.container}>
            <Content>
              {
                data && data.user &&
                <View>
                  <Thumbnail source={{ uri: data.user.avatarUrl }} large />
                  <Title>{data.user.name}</Title>
                  <Subtitle>{data.user.login}</Subtitle>

                  <Text>Repositories: {data.user.repositories.totalCount}</Text>
                  <Text>Followers: {data.user.followers.totalCount}</Text>
                  <Text>Following: {data.user.following.totalCount}</Text>
                  <Text>Stars: {data.user.starredRepositories.totalCount}</Text>

                  <Text>Bio: {data.user.bio}</Text>
                  <Text>Company: {data.user.company}</Text>
                  <Text>Email: {data.user.email}</Text>
                  <Text>Website: {data.user.websiteUrl}</Text>
                  <Text>Organizations: {JSON.stringify(data.user.organizations.nodes)}</Text>
                </View>
              }
            </Content>
          </Container>
        )}
      </Query>
    );
  }
}
