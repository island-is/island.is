'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'field_settings',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
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
          min_value: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          max_value: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          min_length: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          max_length: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          min_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          max_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          min_amount: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          max_amount: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          year: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          has_link: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          url: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          button_text: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          has_property_input: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          has_property_list: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          list_type: {
            type: Sequelize.ENUM(
              'custom',
              'municipalities',
              'countries',
              'postalCodes',
              'mastersTrades',
              'registrationCategoriesOfActivities',
            ),
            allowNull: true,
          },
          file_types: {
            type: Sequelize.JSON,
            allowNull: true,
          },
          file_max_size: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          max_files: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          time_interval: {
            type: Sequelize.ENUM(
              'minutely',
              'quarterly',
              'halfHourly',
              'hourly',
            ),
            allowNull: true,
          },
          field_id: {
            type: Sequelize.UUID,
            onDelete: 'CASCADE',
            allowNull: false,
            references: {
              model: 'field',
              key: 'id',
            },
          },
        },
        { transaction: t },
      ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('field_settings', { transaction: t }),
    )
  },
}
