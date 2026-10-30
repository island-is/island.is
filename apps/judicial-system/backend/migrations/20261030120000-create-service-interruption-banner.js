'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .createTable(
          'service_interruption_banner',
          {
            id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              allowNull: false,
            },
            title: {
              type: Sequelize.STRING,
              allowNull: false,
              defaultValue: 'Mikilvæg skilaboð',
            },
            global_message: {
              type: Sequelize.TEXT,
              allowNull: false,
              defaultValue: '',
            },
            prosecutor_message: {
              type: Sequelize.TEXT,
              allowNull: false,
              defaultValue: '',
            },
            court_message: {
              type: Sequelize.TEXT,
              allowNull: false,
              defaultValue: '',
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
            'service_interruption_banner',
            [
              {
                id: 1,
                title: 'Mikilvæg skilaboð',
                global_message: '',
                prosecutor_message: '',
                court_message: '',
              },
            ],
            { transaction },
          ),
        ),
    ),

  down: (queryInterface) =>
    queryInterface.dropTable('service_interruption_banner', { force: true }),
}
