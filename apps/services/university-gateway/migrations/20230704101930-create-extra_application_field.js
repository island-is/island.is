'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable(
          //TODO rename
          'extra_application_field',
          {
            id: {
              type: Sequelize.UUID,
              primaryKey: true,
              allowNull: false,
              defaultValue: Sequelize.UUIDV4,
            },
            program_id: {
              type: Sequelize.UUID,
              references: {
                model: 'program',
                key: 'id',
              },
              allowNull: false,
            },
            extra_application_field_type_id: {
              type: Sequelize.UUID,
              references: {
                model: 'extra_application_field',
                key: 'id',
              },
              allowNull: false,
            },
            name_is: {
              type: Sequelize.STRING,
            },
            name_en: {
              type: Sequelize.STRING,
            },
            description_is: {
              type: Sequelize.STRING,
            },
            description_en: {
              type: Sequelize.STRING,
            },
            description_en: {
              type: Sequelize.STRING,
            },
            required: {
              type: Sequelize.BOOLEAN,
            },
            upload_accepted_file_type: {
              type: Sequelize.STRING,
            },
          },
          { transaction: t },
        ),
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable('extra_application_field', { transaction: t }),
      ])
    })
  },
}
