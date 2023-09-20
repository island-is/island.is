'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .addColumn(
          'case',
          'request_shared_with_defender',
          {
            type: Sequelize.ENUM('READY_FOR_COURT', 'COURT_DATE'),
            allowNull: true,
          },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE "case" SET request_shared_with_defender = 'COURT_DATE' WHERE send_request_to_defender = true`,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.removeColumn('case', 'send_request_to_defender', {
            transaction,
          }),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .addColumn(
          'case',
          'send_request_to_defender',
          {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE "case" SET send_request_to_defender = true WHERE request_shared_with_defender = 'COURT_DATE'`,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.removeColumn('case', 'request_shared_with_defender', {
            transaction,
          }),
        )
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS enum_case_request_shared_with_defender',
            { transaction },
          ),
        ),
    )
  },
}
