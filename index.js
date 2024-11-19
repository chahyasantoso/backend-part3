const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// ROUTES
app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const note = persons.find((person) => person.id === id)

  if (!note) {
    response.status(404).end()
    return
  }
  response.json(note)
})

app.delete('/api/persons/:id', (request, response) => {
  const id =  request.params.id
  const person = persons.find((person) => person.id === id)
  if (!person) {
    response.status(404).end()
    return 
  }

  persons = persons.filter((person) => person.id !== id)
  response.json(person)
})

//note: server will crash if all 10000 ids are used
const generateId = () => {
  const randomId = Math.floor(Math.random()*10000)
  const person = persons.find(({id}) => Number(id) === randomId)
  if (person) {
    randomId = generateId()
  }
  return randomId
}

app.post('/api/persons', (request, response) => {
  const {name, number} = request.body
  if (!name || !number) {
    response.status(400).json({
      error: 'name or number is missing'
    })
    return
  }
  if (persons.find((person) => person.name.toLowerCase() === name.toLowerCase())) {
    response.status(400).json({
      error: 'name must be unique'
    })
    return
  }
  const newPerson = {
    id: generateId().toString(),
    name,
    number
  }
  persons = [...persons, newPerson]
  response.json(newPerson)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})