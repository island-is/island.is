'use strict'
const yargs = require('yargs/yargs')
const argv = yargs(process.argv.slice(2)).argv
const xlsx = require('xlsx')
const { isPerson } = require('kennitala')

/**
 * We don't expect this data to change to frequently hence we have faced out a admin panel from our current scope.
 * This seeder file serves as out way to update the database safely via data from a excel file.
 * The first row of the excel file must be headers.
 * The excel file should include four columns from left to right: Party letter, party name, owner, managers.
 * Party letter: string (ID PK)
 * Party name: string
 * Owner: string (nationalId)
 * Managers: string (csv of national ids e.g. 0000000000,1111111111)
 *
 * Uploading a excel file containing an existing party letter will update the existing party letter.
 * All fields must be included when updating.
 */

const validateData = (partyLetters) => {
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
    const workSheetsFromFile = xlsx.readFile(argv['source-file'])
    const data = xlsx.utils.sheet_to_json(
      workSheetsFromFile.Sheets[workSheetsFromFile.SheetNames[0]],
    )

    const partyLetters = data.map((data) => {
      const registryData = Object.values(data)
      return {
        party_letter: registryData[0].trim().toUpperCase(),
        party_name: registryData[1].trim(),
        owner: registryData[2].trim(),
        managers: registryData[3]
          .split(',') // we expect national ids to be in a csv format
          .map((managerNationalId) => managerNationalId.trim()) // remove any accidental spaces
          .filter((managerNationalId) => Boolean(managerNationalId)), // remove any empty values
        created: new Date(),
        modified: new Date(),
      }
    })

    console.log('Validating data')
    validateData(partyLetters)

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
      partyLettersAffected: partyLetters.map(
        (partyLetterEntry) => partyLetterEntry.party_letter,
      ),
      count: partyLetters.length,
    })
  },
}
