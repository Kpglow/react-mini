const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/bookModel');
const Author = require('../models/authorModel');

// schema describes the graph
// describes object types, relations
// how to reach particular data, mutate it, etc.
const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                // return _.find(authors, { id: parent.authorId });

                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            // list of book type
            type: new GraphQLList(BookType),
            resolve(parent,args){
                // return _.filter(books, { authorId: parent.id });
                return Book.find({ authorId: parent.id });
            }
        }
    })
})

// how to jump into graph to get data initially
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // no need to worry about order i.e. not func
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from db
                // return _.find(books, { id: args.id });
                return Book.findById(args.id);
            } 
        },

        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return _.find(authors, { id: args.id });
                return Author.findById(args.id);
            }
        },

        books: {
            type: GraphQLList(BookType),
            resolve(parent, args) {
                // return books;
                return Book.find({});
            }
        },

        authors: {
            type: GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors;
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent,args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) },
                genre: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent,args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        },
        deleteBook: {
            type: BookType,
            args: {
                id : { type: new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent, { id }) {
               const deleteBook = await Book.findByIdAndRemove(id)
               return {id: deleteBook.id}
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

// 3 responsibilities
// #1: Define types
// #2: Define relationships
// #3: Define root queries