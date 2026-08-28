'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'indictment_approver_id',
          {
            type: Sequelize.UUID,
            references: { model: 'user', key: 'id' },
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'indictment_review_returned_explanation',
          {
            type: Sequelize.TEXT,
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
        queryInterface.removeColumn('case', 'indictment_approver_id', {
          transaction: t,
        }),
        queryInterface.removeColumn(
          'case',
          'indictment_review_returned_explanation',
          {
            transaction: t,
          },
        ),
      ]),
    )
  },
}
