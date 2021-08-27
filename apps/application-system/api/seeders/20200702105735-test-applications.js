'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'application',
      [
        {
          id: 'f00df00d-f00d-f00d-f00d-f00df00dd00d',
          applicant: '2605923199',
          state: 'collectEndorsements',
          type_id: 'PartyApplication',
          answers: JSON.stringify({
            constituency: 'partyApplicationNordausturkjordaemi2021',
            approveDisclaimer: true
          }),
          status: 'inprogress',
        }
      ],
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('application', null, {})
  },
}
