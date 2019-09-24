import React, {Component}from 'react';
import { graphql } from 'react-apollo';
import {getAuthorsQuery, addBookMutation, getBooksQuery} from '../queries/queries'
import * as compose from 'lodash.flowright';

class AddBook extends Component {
 constructor(props) {
     super(props);
     this.state = {
         bookName: "",
         genre: "",
         author: "",
     }
     this.submitForm = this.submitForm.bind(this)
 }
 submitForm(e) {
    e.preventDefault();
    this.props.addBookMutation({
        variables: {
            name: this.state.bookName,
            genre: this.state.genre,
            authorId: this.state.author
        },
        refetchQueries: [{ query: getBooksQuery }]
    });
 }
 render() {
  return (
    <form id="add-book" onSubmit={this.submitForm}>
        <div className="field">
            <label>Book Name</label>
            <input type="text" onChange={ (e) => this.setState({bookName: e.target.value})}/>
        </div>
        <div className="field">
            <label>Genre</label>
            <input type="text" onChange={ (e) => this.setState({genre: e.target.value})}/>
        </div>
        <div className="field">
            <label>Author: </label>
            <select onChange={(e) => this.setState({author: e.target.value})}>
               <option>Select author</option>
               <DisplayAuthors data={this.props}/>
            </select>
        </div>
        <button>+</button>
    </form>
  );
 }
}

function DisplayAuthors(props) {
    var data = props.data.getAuthorsQuery
    if (data.loading) {
        return (<option>Loading authors</option>)
    } else {
        return (data.authors.map(author=>{
            return (<option key={author.id} value={author.id}>{author.name}</option>)
        }))
    }
}

export default compose(
    graphql(getAuthorsQuery, {name: "getAuthorsQuery"}), graphql(addBookMutation, {name: "addBookMutation"}))(AddBook);

