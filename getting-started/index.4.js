'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const { graphql, buildSchema } = require('graphql');

const PORT = process.env.PORT || 3000;
const server = express();

const schema = buildSchema(`
type Video {
  id: ID,
  title: string,
  duration: Int,
  watched: Boolean
}

type Query {
  video: Video
  videos: [Video]
}

type schema {
  query: query
}
`);

const videoA = {
  id: 'a',
  title: 'Create a GraphQL Schema',
  duration: 120,
  watched: true,
};

const videoB = {
  id: 'b',
  title: 'Ember.js CLI',
  duration: 240,
  watched: false
};

const videos = [videoA, videoB];

const resolvers= {
  video: () => ({
    id: '1',
    title: 'Foo',
    duration: 180,
    watched: true,
  }),
  videos: () => videos
}

const query = `
query myFirstQuery {
  videos {
    id
    title
    duration
    watched
  }
}
`;

server.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
  rootValue: resolvers
}));

server.listen(PORT, () =>{
  console.log(`Listening on http://localhost:${PORT}`)  
});