'use strict'
const yargs = require('yargs/yargs')
const argv = yargs(process.argv.slice(2)).argv
const xlsx = require('node-xlsx')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // get the next version of the data (we use raw here cause the model is in ts)
    const version = await queryInterface
      .rawSelect(
        'voter_registry',
        {
          order: [['version', 'DESC']],
          limit: 1,
        },
        ['version'],
      )
      // bump version by one to get next version
      .then((data) => data + 1 || 1)

    console.log(`Getting data from sourcefile: ${argv['region-file']}`)
    const workSheetsFromFile = xlsx.parse(argv['region-file'])
    const [unusedHeaders, ...userData] = workSheetsFromFile[0].data
    const voterRegions = userData.map((data) => ({
      national_id: data[0].trim(),
      region_number: parseInt(data[1]),
      region_name: data[2].trim(),
      version,
      created: new Date(),
      modified: new Date(),
    }))

    console.log(`Inserting new data into table as version: ${version}`)
    // this ensures data for the new version won't be accessible unless the whole set imports successfully
    const transaction = await queryInterface.sequelize.transaction()
    await queryInterface.bulkInsert('voter_registry', voterRegions, {
      transaction,
    })
    await transaction.commit()
    console.log('Successfully inserted data', {
      sourceFile: argv['region-file'],
    })
  },
}
