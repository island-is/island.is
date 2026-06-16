'use strict'

const CATEGORIES = [
  'COURT',
  'COURT_OF_APPEALS',
  'POLICE',
  'NATIONAL_COMMISSIONERS_OFFICE',
]

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .createTable(
          'message_suspension',
          {
            category: {
              type: Sequelize.STRING,
              primaryKey: true,
              allowNull: false,
            },
            suspended: {
              type: Sequelize.BOOLEAN,
              allowNull: false,
              defaultValue: false,
            },
            delay_seconds: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 600,
            },
            modified_by: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            created: {
              type: 'TIMESTAMP WITH TIME ZONE',
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
              allowNull: false,
            },
            modified: {
              type: 'TIMESTAMP WITH TIME ZONE',
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
              allowNull: false,
            },
          },
          { transaction },
        )
        .then(() =>
          queryInterface.bulkInsert(
            'message_suspension',
            CATEGORIES.map((category) => ({ category })),
            { transaction },
          ),
        ),
    ),

  down: (queryInterface) =>
    queryInterface.dropTable('message_suspension', { force: true }),
}
