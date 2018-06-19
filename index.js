const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
morgan.token('data', (req, res) => {return JSON.stringify(req.body)})

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123123'
    },
    {
        id: 2,
        name: 'Martti Tienari',
        number: '040-123123'
    },
    {
        id: 3,
        name: 'Lea Kutvonen',
        number: '040-123123'
    },
    {
        id: 4,
        name: 'Arto Järvinen',
        number: '040-123123'
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

const generateId = () => {
    const random = Math.floor(Math.random() * 10000)
    return random
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }

    const names = persons.map(p => p.name)
    if (names.includes(body.name)) {
        return res.status(400).json({ error: 'name must be unique' })
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(newPerson)
    res.json(newPerson)
})

app.get('/info', (req, res) => {
    const amount = persons.length
    res.send(`<p>puhelinluettelossa on ${amount} henkilön tiedot</p>
    <p>${new Date()}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})