const { ApolloServer } = require('@apollo/server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('@apollo/server-plugin-landing-page-graphql-playground');
const { expressMiddleware  } = require('@apollo/server/express4');

const typeDefs = `
  type Query {
    hello: String!
    getPerson(name: String, age:Int): String
    getInt(age: Int!): Int
    getFloat(price: Float): Float
    getString: String
    getBoolean: Boolean
    getID: ID
    getNumbers(numbers:[Int!]!): [Int]
    getProduct: Product
  } 

  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String!
    image:  String!
    createdAt: String!
  }
`;

// Get => Query
// Post, PUT, DELETE, PATCH => Mutation
// Subscriptions => Subscription

// Alwasys return a 201.
// Always send as a post request.

// Scalar types: String, Int, Float, Boolean, ID if we put a ! it means that it is required or not null.

// Lists -> [String], [Int], [Float], [Boolean], [ID]

// [Int] -> [1,2,3] [] null [1,2,null]
// [Int]! -> [1,2,3] [] [1,2,null]
// [Int!]! -> [1,2,3] []
const resolvers = {
  Query: {
    hello: () => 'hola mundo',
    getPerson: (_, args) => `Hello, my name is ${args.name} and I am ${args.age} years old`,
    getInt: (_, args)=> args.age,
    getFloat: (_, args)=> args.price,
    getString: ()=> 'palabra',
    getBoolean: ()=> true,
    getID: ()=> '12121212121',
    getNumbers: (_, args)=> args.numbers,
    getProduct: () => {
      return {
        id: '121212',
        name: 'Product 1',
        price: 120.12,
        description: 'This is a product',
        image: 'https://placeimg.com/640/480/tech',
        createdAt: new Date().toISOString()
      }}
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