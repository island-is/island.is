'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'court_session',
          'judge_id',
          {
            type: Sequelize.UUID,
            references: { model: 'user', key: 'id' },
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('court_session', 'judge_id', {
          transaction: t,
        }),
      ]),
    )
  },
}
