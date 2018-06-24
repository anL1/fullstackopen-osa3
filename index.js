const Person = require('./models/Person')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
morgan.token('data', (req, res) => { return JSON.stringify(req.body) })

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))


app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(contacts => {
            res.json(contacts.map(formatContact))
        })
        .catch(error => {
            console.log(error)
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(formatContact(person))
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })

})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    const contact = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(req.params.id, contact, { new: true })
        .then(updatedContact => {
            res.json(formatContact(updatedContact))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })

})

const formatContact = (contact) => {
    return {
        name: contact.name,
        number: contact.number,
        id: contact._id
    }
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })

    newPerson
        .save()
        .then(savedPerson => {
            res.json(formatContact(savedPerson))
        })
})

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(result => {
            res.send(`<p>puhelinluettelossa on ${result.length} henkilön tiedot</p>
    <p>${new Date()}</p>`)
        })
        .catch(error => {
            console.log(error)
            res.status(400)
        })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})