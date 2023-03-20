'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'description',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'request_prosecutor_only_session',
          {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'prosecutor_only_session_request',
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
        queryInterface.removeColumn('case', 'description', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'request_prosecutor_only_session', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'prosecutor_only_session_request', {
          transaction: t,
        }),
      ]),
    )
  },
}
