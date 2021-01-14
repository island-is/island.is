module.exports = (config) => {
  config.entry.migrate = config.entry.main[0].replace('main.ts', 'migrate')
  config.output.filename = '[name].js'
  return {
    ...config,
  }
}
