'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .transaction((t) =>
        queryInterface
          .changeColumn(
            'case_file',
            'key',
            {
              type: Sequelize.STRING,
              allowNull: true,
            },
            { transaction: t },
          )
          .then(() =>
            queryInterface.sequelize.query(
              `UPDATE case_file SET key = NULL, state = 'STORED_IN_RVG' WHERE state = 'BOKEN_LINK';
               ALTER TABLE case_file ALTER COLUMN state DROP DEFAULT;
               ALTER TABLE case_file ALTER COLUMN type DROP DEFAULT;`,
              { transaction: t },
            ),
          ),
      )
      .then(() =>
        // replaceEnum does not support transactions
        replaceEnum({
          queryInterface,
          tableName: 'case_file',
          columnName: 'state',
          newValues: ['STORED_IN_RVG', 'STORED_IN_COURT', 'DELETED'],
          enumName: 'enum_case_file_state',
        }),
      )
  },

  down: (queryInterface, Sequelize) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'case_file',
      columnName: 'state',
      newValues: ['STORED_IN_RVG', 'STORED_IN_COURT', 'BOKEN_LINK', 'DELETED'],
      enumName: 'enum_case_file_state',
    }).then(() =>
      queryInterface.sequelize.transaction((t) =>
        Promise.all([
          queryInterface.sequelize
            .query(`UPDATE case_file SET key = '' WHERE key IS NULL`, {
              transaction: t,
            })
            .then(() =>
              queryInterface.changeColumn(
                'case_file',
                'key',
                {
                  type: Sequelize.STRING,
                  allowNull: false,
                },
                { transaction: t },
              ),
            ),
          queryInterface.sequelize.query(
            `ALTER TABLE case_file ALTER COLUMN state SET DEFAULT 'STORED_IN_RVG'`,
            { transaction: t },
          ),
          queryInterface.changeColumn(
            'case_file',
            'type',
            {
              type: Sequelize.STRING,
              allowNull: false,
              defaultValue: 'application/pdf',
            },
            { transaction: t },
          ),
        ]),
      ),
    )
  },
}
