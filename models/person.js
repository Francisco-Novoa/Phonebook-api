const mongoose = require("mongoose")

mongoose.set('useFindAndModify', false);

const url = process.env.MONGODB_URI

console.log(`connecting to MongoDb ${url}`)

//database connection
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch(error => {
        console.log(url)
        console.log(`error connecting to MongoDb ${error.message}`)
    })


//schema definitions
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personSchema)