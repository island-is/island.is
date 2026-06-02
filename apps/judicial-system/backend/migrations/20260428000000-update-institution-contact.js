'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkInsert(
        'institution_contact',
        [
          {
            id: 'c693cca1-baf7-4048-af06-1215c5791c5d',
            created: new Date(),
            modified: new Date(),
            institution_id: '8f9e2f6d-6a00-4a5e-b39b-95fd110d762e',
            value: 'saksoknari@saksoknari.is',
            type: 'INDICTMENT_REOPENED',
          },
        ],
        { transaction: t },
      ),
    )
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkDelete(
        'institution_contact',
        { id: 'c693cca1-baf7-4048-af06-1215c5791c5d' },
        { transaction: t },
      ),
    )
  },
}
