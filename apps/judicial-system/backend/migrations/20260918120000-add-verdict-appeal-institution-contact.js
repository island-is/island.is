'use strict'

// Where the public prosecution is told that a verdict has been appealed. The
// same address already takes reopened indictments; contacts are looked up by
// institution and notification type, so one address serves both.
const contact = {
  id: 'a5457ceb-d973-417e-aab4-734562d982c6',
  institution_id: '8f9e2f6d-6a00-4a5e-b39b-95fd110d762e',
  value: 'saksoknari@saksoknari.is',
  type: 'INDICTMENT_VERDICT_APPEALED',
}

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkInsert(
        'institution_contact',
        [{ ...contact, created: new Date(), modified: new Date() }],
        { transaction: t },
      ),
    )
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkDelete(
        'institution_contact',
        { id: contact.id },
        { transaction: t },
      ),
    )
  },
}
