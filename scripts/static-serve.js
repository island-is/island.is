const yargs = require('yargs')
const express = require('express')
const path = require('path')
const app = express()

// Setup command line args
// prettier-ignore
const argv = yargs
  .option('dist', {
    alias: 'd',
    demandOption: true,
    requiresArg: true,
    description: 'Dist folder of the app to serve from.',
    type: 'string',
  })  
  .option('base-path', {
    alias: 'b',
    default: '/',
    description: 'Base path of the app if it is deployed to a sub-folder.',
    requiresArg: true,
    type: 'string'
  })  
  .option('port', {
    alias: 'p',
    default: '4200',
    description: 'Port number to serve the app from.',
    type: 'number',
  })
  .help()
  .alias('help', 'h')
  .argv

// Set the path for static file serve
app.use(argv['base-path'], express.static(path.join(process.cwd(), argv.dist)))

// Create base path to contain * to return index.html for all sub-paths
// to let client handle routing.
const basePath =
  argv['base-path'] + (argv['base-path'].endsWith('/') ? '*' : '/*')

// Set the root path of the app to serve index.html
app.get(basePath, function (req, res) {
  res.sendFile(path.join(process.cwd(), argv.dist, 'index.html'))
})

const server = app.listen(argv.port)
console.log(`App listening on port ${argv.port}...`)
