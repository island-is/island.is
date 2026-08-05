'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'court_session',
        'ruling_file_id',
        {
          type: Sequelize.UUID,
          allowNull: true,
          unique: true,
          references: { model: 'case_file', key: 'id' },
          onUpdate: 'NO ACTION',
          onDelete: 'NO ACTION',
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('court_session', 'ruling_file_id', {
        transaction: t,
      }),
    )
  },
}
