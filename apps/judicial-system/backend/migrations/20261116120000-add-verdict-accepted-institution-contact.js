'use strict'

// Where the public prosecution is told that a defender has registered that the
// defendant accepts a verdict. The same address already takes verdict appeals;
// contacts are looked up by institution and notification type.
const contact = {
  id: '7d397187-963b-4e1f-8b98-c29303b0e933',
  institution_id: '8f9e2f6d-6a00-4a5e-b39b-95fd110d762e',
  value: 'saksoknari@saksoknari.is',
  type: 'INDICTMENT_VERDICT_ACCEPTED_BY_DEFENDER',
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
