'use strict';

const { graphql, buildSchema } = require('graphql');

const schema = buildSchema(`
type Query 
  foo: String
}

type schema {
  query: query
}
`);

const resolvers= {
  foo: () => 'bar'
}

const query = `
query myFirstQuery {
  foo
}
`;

graphql(schema, query, resolvers)
  .then((result) => console.log(result))
  .catch((error) => console.log(error));