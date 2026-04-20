'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'court_document',
          'merged_document_order',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'court_document',
          'merged_court_session_id',
          {
            type: Sequelize.UUID,
            references: { model: 'court_session', key: 'id' },
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
        queryInterface.removeColumn('court_document', 'merged_document_order', {
          transaction: t,
        }),
        queryInterface.removeColumn(
          'court_document',
          'merged_court_session_id',
          {
            transaction: t,
          },
        ),
      ]),
    )
  },
}
