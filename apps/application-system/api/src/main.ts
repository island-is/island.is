import yargs from 'yargs'

const { argv } = yargs(process.argv.slice(2))

if (argv.job === 'worker') {
  import('./worker').then((app) => {
    app.worker()
  })
} else {
  import('./app').then((app) => {
    // dummy change
    app.bootstrapServer()
  })
}
