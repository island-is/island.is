//import yargs from 'yargs'
const yargs = require('yargs');
const { argv } = yargs(process.argv.slice(2))

if (argv.job === 'worker') {
  import('./worker').then((app) => {
    app.worker()
  })
} else {
  import('./app').then((app) => {
    app.bootstrapServer()
  })
}
