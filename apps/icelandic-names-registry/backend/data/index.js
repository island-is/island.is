const { parse } = require('csv-parse/sync')
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

const setEmptyToNull = (x) => (x === 'NULL' || x.trim() === '' ? null : x)

const remapped = data.map((x) => ({
  icelandic_name: x.icelandic_name.toLowerCase(),
  status: setEmptyToNull(x.status),
  visible: x.visible === '1',
  type: setEmptyToNull(x.type),
  description: setEmptyToNull(x.description),
  verdict: setEmptyToNull(x.verdict),
}))

module.exports = remapped
