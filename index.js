import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import express from 'express';
import cors from 'cors';

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();
app.use(cors(), express.json(), expressMiddleware(server));
app.listen(4000, () => {
  console.log('🚀 Server ready at http://localhost:4000/graphql');
});
