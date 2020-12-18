import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider
} from '@apollo/client';
import { setContext } from 'apollo-link-context';

import App from './App';

const httpLink = createHttpLink({
  uri: 'http://localhost:5000'
});

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getPosts: {
            merge(_, incoming) {
              return incoming;
            }
          }
        }
      },
      Post: {
        fields: {
          comments: {
            merge(_, incoming) {
              return incoming;
            }
          },
          likes: {
            merge(_, incoming) {
              return incoming;
            }
          }
        }
      }
    }
  })
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
