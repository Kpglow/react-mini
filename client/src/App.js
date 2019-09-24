import React, {Component}from 'react';
import BookList from './components/BookList';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, renderToStringWithData } from 'react-apollo'
import AddBook from './components/addBook';
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

class App extends Component {
  render() {
  return (
    <ApolloProvider client={client}>
      <div id="main">
        <h1>List of Books</h1>
        <BookList/>
        <AddBook/>
      </div>
    </ApolloProvider>
  );
  }
}

export default App;
