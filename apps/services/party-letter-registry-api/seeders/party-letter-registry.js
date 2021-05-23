'use strict'
const yargs = require('yargs/yargs')
const argv = yargs(process.argv.slice(2)).argv
const xlsx = require('node-xlsx')
const { isPerson } = require('kennitala')

const validateImportedData = (partyLetters) => {
  const errors = []
  partyLetters.forEach((partyLetter) => {
    if (!isPerson(partyLetter.owner)) {
      errors.push(`Owner nationalId check failed for ${partyLetter.party_name}`)
    }
    partyLetter.managers.forEach((manager, index) => {
      if (!isPerson(manager)) {
        errors.push(
          `Manager nationalId check failed for ${partyLetter.party_name} for manager ${manager} at index ${index}`,
        )
      }
    })
    if (
      partyLetter.party_letter.length < 1 ||
      partyLetter.party_letter.length > 2
    ) {
      errors.push(
        `Party letter length check failed for ${partyLetter.party_name}`,
      )
    }
  })
  if (errors.length > 0) {
    throw new Error(`Validation failed:\n${errors.join('\n')}`)
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log(`Getting data from sourcefile: ${argv['source-file']}`)
    const workSheetsFromFile = xlsx.parse(argv['source-file'], {})
    const [unusedHeaders, ...partyLetterData] = workSheetsFromFile[0].data

    const partyLetters = partyLetterData
      .filter((partyLetterRow) => partyLetterRow.length)
      .map((data) => ({
        party_letter: data[0].trim().toUpperCase(),
        party_name: data[1].trim(),
        owner: data[2].trim(),
        managers: data[3]
          .split(',') // we expect national ids to be in a csv format
          .map((managerNationalId) => managerNationalId.trim()) // remove any accidental spaces
          .filter((managerNationalId) => Boolean(managerNationalId)), // remove any empty values
        created: new Date(),
        modified: new Date(),
      }))

    console.log('Validating imported data')
    validateImportedData(partyLetters)

    console.log('Inserting new data into table')

    // we don't want partial updates to make the current state of the database obvious if updates fail
    const transaction = await queryInterface.sequelize.transaction()
    const requests = partyLetters.map(async (partyLetter) => {
      const { party_letter, ...partyLetterData } = partyLetter
      return await queryInterface.upsert(
        'party_letter_registry',
        { party_letter, ...partyLetterData },
        partyLetterData,
        { party_letter },
        queryInterface.sequelize.define(),
        { transaction },
      )
    })

    // lets wait for all requests to finish
    await Promise.all(requests).catch((response) => {
      console.error(response)
      throw response
    })

    await transaction.commit()
    console.log('Successfully inserted data', {
      sourceFile: argv['source-file'],
    })
  },
}
