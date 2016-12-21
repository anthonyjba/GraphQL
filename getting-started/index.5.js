'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const { 
  GrapgQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean  
} = require('graphql');

const PORT = process.env.PORT || 3000;
const server = express();

const videoType = new GraphQLObjectType({
  name: 'video',
  description: 'A video on Egghead.io',
  fields: {
    id: {
      type: GraphQLID,
      description: 'The id of the video.', 
    },
    title: {
      type: GraphQLString,
      description: 'The title of the video.'
    },
    duration: {
      type: GraphQLInt,
      description: 'The duration of the video (in seconds).',
    }
  }
});


const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    video:{
      type: videpType,
      resolve: () => new Promise((resolve) => {
        resolve({
          id: 'a',
          title: 'GraphQL',
          duration: 180,
          watched: false
        });
      }),
    }
  },
});

const schema = new GraphQLSchema({
  query: queryType,
})

const schema1 = buildSchema(`
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