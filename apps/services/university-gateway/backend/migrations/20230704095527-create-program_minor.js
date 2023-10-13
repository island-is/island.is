'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable(
          'program_minor',
          {
            id: {
              type: Sequelize.UUID,
              primaryKey: true,
              defaultValue: Sequelize.UUIDV4,
              allowNull: false,
            },
            program_id: {
              type: Sequelize.UUID,
              references: {
                model: 'program',
                key: 'id',
              },
              allowNull: false,
            },
            external_id: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            name_is: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            name_en: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            created: {
              type: Sequelize.DATE,
              allowNull: false,
            },
            modified: {
              type: Sequelize.DATE,
              allowNull: false,
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
        queryInterface.dropTable('program_minor', {
          transaction: t,
        }),
      ])
    })
  },
}
