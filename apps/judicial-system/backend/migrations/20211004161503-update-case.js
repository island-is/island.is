'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn(
          'case',
          'creating_prosecutor_id',
          {
            type: Sequelize.UUID,
            references: {
              model: 'user',
              key: 'id',
            },
            allowNull: true,
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            'UPDATE "case" SET creating_prosecutor_id=prosecutor_id',
            { transaction: t },
          ),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('case', 'creating_prosecutor_id', {
        transaction: t,
      }),
    )
  },
}
