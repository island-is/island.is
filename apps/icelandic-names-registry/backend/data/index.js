const parse = require('csv-parse/lib/sync')
const fs = require('fs')
const path = require('path')

const newNames = {
  IcelandicNameID: 'id',
  IcelandicName: 'icelandic_name',
  Afgreitt: 'status',
  Birta: 'visible',
  Tegund: 'type',
  Skyring: 'description',
  Urskurdur: 'verdict',
}

const file = path.join(__dirname, 'IcelandicName.csv')
const csv = fs.readFileSync(file, 'utf8', (_, data) => data)
const data = parse(csv, {
  columns: (header) =>
    header.map((column) => {
      return newNames[column]
    }),
})

module.exports = data
