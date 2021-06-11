'use strict'
const yargs = require('yargs/yargs')
const argv = yargs(process.argv.slice(2)).argv
const xlsx = require('xlsx')
const { isPerson } = require('kennitala')

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

const validateData = (voterRegions) => {
  const errors = []

  // we want to make sure the data we are inserting is consistent
  const validRegionNumbers = [1, 2, 3, 4, 5, 6]
  const validRegionNames = [
    'Norðvesturkjördæmi',
    'Norðausturkjördæmi',
    'Reykjavíkurkjördæmi norður',
    'Reykjavíkurkjördæmi suður',
    'Suðvesturkjördæmi',
    'Suðurkjördæmi',
  ]

  voterRegions.forEach((voterRegion) => {
    if (!isPerson(voterRegion.national_id)) {
      errors.push(`NationalId check failed for ${voterRegion.national_id}`)
    }

    if (!validRegionNames.includes(voterRegion.region_name)) {
      errors.push(
        `${voterRegion.region_name} is was not found in region names, is this a typo?`,
      )
    }

    if (!validRegionNumbers.includes(voterRegion.region_number)) {
      errors.push(
        `${voterRegion.region_number} is was not found in region numbers, is this a typo?`,
      )
    }
  })
  if (errors.length > 0) {
    throw new Error(`Validation failed:\n${errors.join('\n')}`)
  }
}

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

    console.log(`Getting data from sourcefile: ${argv['source-file']}`)

    const workSheetsFromFile = xlsx.readFile(argv['source-file'])
    const data = xlsx.utils.sheet_to_json(
      workSheetsFromFile.Sheets[workSheetsFromFile.SheetNames[0]],
    )

    const voterRegions = data.map((data) => {
      const registryData = Object.values(data)
      return {
        national_id: registryData[0].trim(),
        region_number: parseInt(registryData[1]),
        region_name: registryData[2].trim(),
        version,
        created: new Date(),
        modified: new Date(),
      }
    })

    console.log('Validating data')
    validateData(voterRegions)

    console.log(`Inserting new data into table as version: ${version}`)
    // this ensures data for the new version won't be accessible unless the whole set imports successfully
    const transaction = await queryInterface.sequelize.transaction()
    await queryInterface.bulkInsert('voter_registry', voterRegions, {
      transaction,
    })
    await transaction.commit()
    console.log('Successfully inserted data', {
      sourceFile: argv['source-file'],
      count: voterRegions.length,
    })
  },
}
