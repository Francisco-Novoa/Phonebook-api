/*
const mongoose = require("mongoose")
require("dotenv").config()



if (process.argv.length < 3) {
    console.log("Please provide the password as an argument: node mongo.js <password>")
    process.exit(1)
}

const password = process.argv[2]

const url = process.env.MONGODB_URI

console.log(`connecting to ${url}`)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result=>{
    console.log("connected to MongoDB")
  })
  .catch(error=>{
    console.log(`error connecting to MongoDb ${error.message}`)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 3) {
  Person.find({})
    .then(users => {
      users.forEach((elem) => {
        console.log(`${elem.name} ${elem.number}`)
      })
    })
    .then(() => {
      mongoose.connection.close()
      process.exit(1)
    })
}


if (process.argv.length === 5) {
  const newperson = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  newperson.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
*/