const fs = require('fs')
const crypto = require('crypto')
const { globSync } = require('glob')
const yargs = require('yargs')

const { argv } = yargs.command('$0 [files..]', 'Hash globs of files').help()

const globs = argv.files || []
const files = globSync(globs, { ignore: '**/node_modules/**' })
const hash = crypto.createHash('sha256')

files.forEach((file) => {
  const fileContent = fs.readFileSync(file)
  hash.update(fileContent)
})

console.log(hash.digest('hex'))
