// @ts-check

import fs from 'fs'
import path from 'path'

const data = process.env.JSON_DATA ? JSON.parse(process.env.JSON_DATA) : null

if (typeof data !== 'object' || data == null) {
  throw new Error('Invalid data type')
}

const keys = Object.keys(data.value)

const result = keys.map((key) => {
  const values = Object.keys(data).reduce((a, b) => {
    return {
      ...a,
      [b]: data[b][key],
    }
  }, {})

  return {
    id: key,
    ...values,
  }
})

const tmpFilePath = path.join('/tmp', 'data.json')
fs.writeFileSync(tmpFilePath, JSON.stringify(result, null, 2))
