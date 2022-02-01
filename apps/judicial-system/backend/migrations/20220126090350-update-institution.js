'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkInsert(
        'institution',
        [
          {
            id: '8f9e2f6d-6a00-4a5e-b39b-95fd110d762e',
            name: 'Ríkissaksóknari',
            type: 'PROSECUTORS_OFFICE',
            active: true,
          },
        ],
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkDelete(
        'institution',
        {
          id: ['8f9e2f6d-6a00-4a5e-b39b-95fd110d762e'],
        },
        { transaction: t },
      ),
    )
  },
}
