const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/shcema')
const mongoose = require('mongoose')

const cors = require('cors')


const app = express()
const PORT = 3005

mongoose.connect('mongodb+srv://admin:123Qwe456@graphqlcluster.q3nqx.mongodb.net/tutorial?retryWrites=true&w=majority',{
  useUnifiedTopology: true,
});

app.use(cors())


app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))


const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => console.log('Connected to DB!'));

app.listen(PORT, err => {
  err ?console.log(err) : console.log('Server started')
})

