const graphql = require('graphql');
const _ = require('lodash')
// schema describes the graph
// describes object types, relations
// how to reach particular data, mutate it, etc.

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

var books = [
    {name: 'Name of the wind', genre: 'Fantasy', id: '1', authorId: '1'},
    {name: 'Harry Potter', genre: 'Fantasy', id: '1', authorId: '2'},
    {name: 'Happy Times', genre: 'Fantasy', id: '1', authorId: '2'},
    {name: 'Dealing with loss', genre: 'Fantasy', id: '1', authorId: '1'},
];

var authors = [
    {name: 'Patrick Rothfuss', age:44, id:'1'},
    {name: 'Karl Wong', age:22, id:'2'}
]
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return _.find(authors, { id: parent.authorId });
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
                return _.filter(books, { authorId: parent.id });
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
                return _.find(books, { id: args.id });
            } 
        },

        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(authors, { id: args.id });
            }
        },

        books: {
            type: GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        },

        authors: {
            type: GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})

// 3 responsibilities
// #1: Define types
// #2: Define relationships
// #3: Define root queries