
//"imports"
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require("dotenv").config()
const Person = require('./models/person.js')


//middleware

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())


//morgan config
morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens["body", (req, res)]
    ].join(' ')
})

morgan.token("body", (req, res) => {
    if (req.method === "POST" || req.method === "PUT") {
        return `{"name":"${req.body.name}","number": "${req.body.number}"}`
    }
})




//routes
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(persons => res.json(persons))
        .catch(error => console.error(error))
})

app.get(`/api/info`, (req, res) => {
    let now = new Date()
    Person.find({})
        .then(persons => {
            res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${now.toString()}<p>`)
        })
        .catch(error => {
            console.log(error)
        })
})

app.get(`/api/persons/:id`, (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            }
            else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete(`/api/persons/:id`, (req, res) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => res.status(204).end())
        .catch(error => next(error))
})

app.put(`/api/persons/:id`, (req, res) => {
    Person.findByIdAndUpdate(req.params.id, req.body)
        .then(result => res.status(200).send(result))
        .catch(error => console.log(error))
})

app.post('/api/persons', (req, res, next) => {
    let person = req.body

    const newperson = new Person({
        name: person.name,
        number: person.number,
    })

    newperson
        .save()
        .then(personSaved => personSaved.toJSON())
        .then(savedAndFormatedPerson => res.json(savedAndFormatedPerson))
        .catch(error => next(error))
})


//handler of 404s
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

//handler of errors
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === "ValidationError") {
        return response.status(400).send({ message: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})