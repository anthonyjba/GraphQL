'use strict';

const { graphql, buildSchema } = require('graphql');

const schema = buildSchema(`
type Query 
  id: ID,
  title: string,
  duration: Int,
  watched: Boolean
}

type schema {
  query: query
}
`);

const resolvers= {
  id: () => '1',
  title: () => 'bar',
  duration: () => 180,
  watched: () => true,
}

const query = `
query myFirstQuery {
  id
  title
  duration
  watched
}
`;

graphql(schema, query, resolvers)
  .then((result) => console.log(result))
  .catch((error) => console.log(error));