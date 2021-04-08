const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = graphql

const Movies = require('../models/movies')
const Directors = require('../models/directors')

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    rate: { type: GraphQLInt },
    watched: { type: new GraphQLNonNull(GraphQLBoolean) },
    director: {
      type: DirectorType,
      resolve ({ directorId }, args) {
        return Directors.findById(directorId)
      }
    }
  }),
})

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve ({ id }, args) {
        return Movies.find({ directorId: id })
      },
    },
  }),
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: new GraphQLNonNull((GraphQLString)) },
        age: { type: new GraphQLNonNull((GraphQLInt)) },
      },
      resolve (parent, { name, age }) {
        const director = new Directors({
          name,
          age,
        })
        return director.save()
      },
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        rate: { type: GraphQLInt },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        directorId: { type: GraphQLID },
      },
      resolve (parent, {name, genre, rate, watched, directorId }) {
        const movie = new Movies({
          name,
          genre,
          rate,
          watched,
          directorId,
        })
        return movie.save()
      },
    },
    deleteDirector: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve (parent, { id }) {
        return Directors.findByIdAndRemove(id)
      }
    },
    deleteMovie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve (parent, {id}) {
        return Movies.findByIdAndRemove(id)
      }
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve (parent, { id, name, age }) {
        return Directors.findByIdAndUpdate(
          id,
          { $set: { name, age } },
          { new: true }
        )
      },
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        rate: { type: GraphQLInt },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        directorId: { type: GraphQLID }
      },
      resolve (parent, { id, name, genre, rate, watched, directorId }) {
        return Movies.findByIdAndUpdate(
          id,
          { $set: { name, genre, rate, watched, directorId  } },
          { new: true }
        )
      },
    },
  }
})

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve (parent, args) {
        return Movies.findById(args.id)
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve (parent, args) {
        return Directors.findById(args.id)
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve (parent, args) {
        return Movies.find({})
      }
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve (parent, args) {
        return Directors.find({})
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
})