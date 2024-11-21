const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    validate: (v) => {
      const numbers = v.split('-')
      if (numbers.length !== 2) {
        return false
      }
      const isNumber = (value) => /^\d+$/.test(value)
      const [part1, part2] = numbers
      console.log(isNumber(part1))
      console.log(isNumber(part2))
      console.log(part1.length)
      if (
        !isNumber(part1) || !isNumber(part2) ||
        !(part1.length === 2 || part1.length === 3)
      ) {
        return false
      }
      return true
    },
    minLength: 8,
    required: true,
  }
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', phonebookSchema)