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

const remapped = data.map((x) => {
  if (x.visible === 1) {
    x.visible = true
  }

  Object.keys(x).map((k) => {
    if (x[k] === 'NULL' || x[k].trim() === '') {
      // reset empty values to null
      x[k] = null
    }

    if (k === 'icelandic_name') {
      x[k] = x[k].toLowerCase()
    }
  })

  // make db create id for record
  delete x.id
  return x
})

module.exports = remapped
