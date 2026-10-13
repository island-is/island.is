'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'appeal_prosecutor_id',
        {
          type: Sequelize.UUID,
          references: { model: 'user', key: 'id' },
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('case', 'appeal_prosecutor_id', {
        transaction: t,
      }),
    )
  },
}
