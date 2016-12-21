'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const { 
  GrapgQLSchema,
  GraphQLObjectType,
  graphQLInputObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean  
} = require('graphql');
const { getVideoById, getVideos, createVideo } = require('./src/data');

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
    videos : {
      type: new GraphQLList(videoType),
      resolve: getVideos
    },
    video:{
      type: videpType,
      args: {
        id: {
          type: GraphQLID,
          description: 'The id of the video.'
        }
      },
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

const videoInputType = new graphQLInputObjectType({
  name: 'VideoInput',
  fields: {
    title: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The title of the video.'
        },
        duration: {
          type: new GraphQLNonNull(GraphQLInt),
          description: 'The duration of the video (in seconds).'
        },
        released: {
          type: new GraphQLNonNull(GraphQLBoolean),
          description: 'Whether or not the video is released.'
        }
  }
});

        

const mutationType = new GraphQLObjectType({
  name: 'mutation',
  description: 'the root mutation type.',
  fields: {
    createVideo: {
      type: videoType, 
      args: {
        video: {
          type: new GraphQLNonNull(videoInputType)
        },   
      },
      resolve: (_, args) => {
        return createVideo(args.video);
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
})

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