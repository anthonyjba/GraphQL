'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const { 
  GrapgQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean  
} = require('graphql');
const { getVideoById, getVideos, createVideo } = require('./src/data');
const { 
  globalIdField, 
  connectionDefinitions,
  connectionFromPromisedArray,
  connectionArgs,
} = require('graphql-relay');
const { nodeInterface, nodeField } = require('./src/node')

const PORT = process.env.PORT || 3000;
const server = express();

const intructorType = new GraphQLObjectType({
  fields: {
    id: {
      type: GraphQLID,
      description: 'the Id of the video.'
    }
  },
  interfaces: [nodeInterface]
});

const videoType = new GraphQLObjectType({
  name: 'video',
  description: 'A video on Egghead.io',
  fields: {
    id: globalIdField(),    
    title: {
      type: GraphQLString,
      description: 'The title of the video.'
    },
    duration: {
      type: GraphQLInt,
      description: 'The duration of the video (in seconds).',
    },
    released: {
      type: GraphQLBoolean,
      description: 'Whether or not the video has been released.'
    }
  },
  interfaces: [nodeInterface],
});
exports.videoType = videoType;

const { connectionType: videoConnection } = connectionDefinitions({
  nodeType: videoType,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
      description: 'A count of the total number of objects in this connection.',
      resolve: (conn) => {
        return conn.edges.length
      }
    }
  })
})

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    node: nodeField,
    videos : {
      type: videoConnection,
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(
        getVideos(),
        args
      )  
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

const mutationType = new GraphQLObjectType({
  name: 'mutation',
  description: 'the root mutation type.',
  fields: {
    createVideo: {
      type: videoType,
      args: {
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
      },
      resolve: (_, args) => {
        return createVideo(args);
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