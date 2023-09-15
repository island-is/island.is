'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkInsert(
        'institution',
        [
          {
            id: '0b4e39bb-2177-4dfc-bb7b-7bb6bc42a661',
            name: 'Lögreglustjórinn á Suðurnesjum',
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
          id: ['0b4e39bb-2177-4dfc-bb7b-7bb6bc42a661'],
        },
        { transaction: t },
      ),
    )
  },
}
