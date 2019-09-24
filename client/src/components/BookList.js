import React, {Component}from 'react';
import { graphql } from 'react-apollo';
import {getBooksQuery, deleteBookMutation} from '../queries/queries'
import * as compose from 'lodash.flowright';
import BookDetails from './BookDetails';
class BookList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        }
        this.deleteBook = this.deleteBook.bind(this)
    }
    deleteBook(bookId) {
        this.props.deleteBookMutation({
            variables: {
                id: bookId
            },
            refetchQueries: [{ query: getBooksQuery }]
        })
    }
    displayBooks() {
        var data = this.props.getBooksQuery
        if(data.loading) {
            return (<div>Loading...</div>)
        } else {
            return data.books.map(book=>{
                return (<li li key= {book.id} onClick={(e)=>{ this.setState({ selected: book.id })}}>{book.name}
                <button id="delete-button" button onClick={()=>this.deleteBook(book.id)}> Delete </button></li>)
            })
        }
    }
 render() {
  return (
    <div id="main">
        <ul id="book-list">
            {this.displayBooks()}
        </ul>
        <BookDetails bookId={ this.state.selected }/>
    </div>
  );
 }
}

export default compose(graphql(getBooksQuery,{name:"getBooksQuery"}), graphql(deleteBookMutation, {name:"deleteBookMutation"}))(BookList);
