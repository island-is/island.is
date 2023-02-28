'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'parent_case_id',
        {
          type: Sequelize.UUID,
          references: {
            model: 'case',
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
      queryInterface.removeColumn('case', 'parent_case_id', {
        transaction: t,
      }),
    )
  },
}
