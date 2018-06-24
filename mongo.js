const mongoose = require('mongoose')

const url = 'mongodb://xxx:xxx@ds163700.mlab.com:63700/fsopen-contacts'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv.length === 4) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })

    person
        .save()
        .then(result => {
            console.log(`Connection ${person.name}, ${person.number} saved to database`)
            mongoose.connection.close()
        })
} else {
    Person
        .find({})
        .then(result => {
            console.log('Addressbook:')
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
}