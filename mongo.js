const mongoose = require('mongoose')

if (process.argv.length<3 ) {
  console.log('arg not complete')
  process.exit(1)
}


const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]


const url =
  `mongodb+srv://fullstack:${password}@cluster0.qjwlc.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', phonebookSchema)

const person = new Person({
  name,
  number
})

person.save()
  .then(({name, number}) => {
    console.log(`added ${name} number ${number} to phonebook`)
  })

Person.find({})
  .then(persons => {
    console.log('Phonebook:')
    persons.forEach(({name, number}) => {
      console.log(name, number)
    })
    mongoose.connection.close()
  })