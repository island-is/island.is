'use strict'
const yargs = require('yargs/yargs')
const argv = yargs(process.argv.slice(2)).argv
const xlsx = require('node-xlsx')

/**
 * The national registry provides us with a excel file containing the temporary voter registry.
 * This seeder file serves as out way to update the database safely via data from that excel file.
 * The first row of the excel file must be headers.
 * The excel file should include three columns from left to right: National id, region number, region name.
 * national_id: string
 * region_number: number
 * region_name: string
 *
 * Uploading a excel file will always bump the version the voter registry will not serve data from older version.
 * The voter registry service will find the current active version on the first request to the service.
 * The temporary voter registry must be updated in its entirety to ensure all data belongs to the same version.
 */

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
