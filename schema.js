import gql from 'graphql-tag';

export const typeDefs = gql`
  type Book {
    _id: ID
    title: String
    author: String
    genre: String
  }

  type Query {
    books: [Book]
    searchBooks(query: String!): [Book]
  }

  type Mutation {
    addBook(title: String!, author: String!, genre: String!): Book
    updateBook(id: ID!, title: String, author: String, genre: String): Book
    deleteBook(id: ID!): Boolean
  }
`;
