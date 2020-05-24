
//hardcoded data
let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

//"imports"
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

//middleware
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body' ))
app.use(express.static('build'))


morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens["body",(req,res)]
    ].join(' ')
  })

morgan.token("body",(req, res)=>{
    return `{"name":"${req.body.name}","number": "${req.body.number}"}`
})

//function
const generateId = () => {
    return parseInt(Math.random() * 15000)
}


//routes
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get(`/api/info`, (req, res) => {
    let now = new Date()
    let payload = `<p>Phonebook has info for ${persons.length} people</p><p>${now.toString()}<p>`
    response.send(payload);
})

app.get(`/api/persons/:id`, (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)

    }
    else {
        res.status(404).end()
    }
})

app.delete(`/api/persons/:id`, (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        const without = persons.filter(aux => aux !== person)
        persons = [...without]
        res.status(204).end()
    }
    else {
        res.status(204).end()
    }
})

app.post('/api/persons', (req, res) => {
    let person = req.body

    if (!person.hasOwnProperty("name")) {
        return res.status(400).json({
            error: 'name property missing'
        })
    }

    if (!person.hasOwnProperty("number")) {
        return res.status(400).json({
            "error": "number property missing"
        })
    }

    const isthere = persons.find(a => a.name === person.name)
    if (isthere){
        return res.status(400).json({error:"name must be unique"})
    }

    person["id"] = generateId()

    persons.push(person)
    console.log(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})