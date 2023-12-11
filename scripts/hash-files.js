const fs = require('fs')
const crypto = require('crypto')
const { globSync } = require('glob')
const yargs = require('yargs')

/**
 * This script is to hash "input" files for NX build target cache logic.
 * We need it for some files which are git ignored as NX ignores those files
 * by default.
 *
 * They do say that .nxignore can override gitignored files, but we've been
 * unable to make that work (see api.graphql). So adding our own runtime hasher
 * as suggested in this issue: https://github.com/nrwl/nx/issues/6821
 */

const { argv } = yargs.command('$0 [files..]', 'Hash globs of files').help()

const globs = argv.files || []
const files = globSync(globs, { ignore: '**/node_modules/**' })
const hash = crypto.createHash('sha256')

files.forEach((file) => {
  const fileContent = fs.readFileSync(file)
  hash.update(fileContent)
})

console.log(hash.digest('hex'))
