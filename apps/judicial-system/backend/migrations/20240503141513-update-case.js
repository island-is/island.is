'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'indictment_reviewer_id',
          {
            type: Sequelize.UUID,
            references: {
              model: 'user',
              key: 'id',
            },
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
        queryInterface.removeColumn('case', 'indictment_reviewer_id', {
          transaction: t,
        }),
      ]),
    )
  },
}
