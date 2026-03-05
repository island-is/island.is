'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkInsert(
        'institution_contact',
        [
          {
            id: 'cee2e077-ffa1-4680-8588-b95b6b875c55',
            created: new Date(),
            modified: new Date(),
            institution_id: 'c9b3b124-2a85-11ec-8d3d-0242ac130003',
            value: 'fms@fangelsi.is',
            type: 'INDICTMENT_SENT_TO_PRISON_ADMIN',
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
        { id: 'cee2e077-ffa1-4680-8588-b95b6b875c55' },
        { transaction: t },
      ),
    )
  },
}
