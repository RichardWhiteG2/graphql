const { ApolloServer } = require('@apollo/server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('@apollo/server-plugin-landing-page-graphql-playground');
const { expressMiddleware  } = require('@apollo/server/express4');

const typeDefs = `
  type Query {
    hello: String
    getPerson(name: String, age:Int): String
    getInt(age: Int): Int
    getFloat(price: Float): Float
    getString: String
    getBoolean: Boolean
    getID: ID
  } 
`;

const resolvers = {
  Query: {
    hello: () => 'hola mundo',
    getPerson: (_, args) => `Hello, my name is ${args.name} and I am ${args.age} years old`,
    getInt: (_, args)=> args.age,
    getFloat: (_, args)=> args.price,
    getString: ()=> 'palabra',
    getBoolean: ()=> true,
    getID: ()=> '12121212121',
  }
}

const useGraphql = async (app) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground
    ]
  });

  await server.start();

  app.use(expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }));
  
}
module.exports = useGraphql