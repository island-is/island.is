'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'shared_with_prosecutors_office_id',
        {
          type: Sequelize.UUID,
          references: {
            model: 'institution',
            key: 'id',
          },
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('case', 'shared_with_prosecutors_office_id', {
        transaction: t,
      }),
    )
  },
}
