'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable(
          'application',
          {
            id: {
              type: Sequelize.UUID,
              primaryKey: true,
              allowNull: false,
              defaultValue: Sequelize.UUIDV4,
            },
            national_id: {
              type: Sequelize.STRING,
            },
            university_id: {
              type: Sequelize.UUID,
              references: {
                model: 'university',
                key: 'id',
              },
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
            application_status_id: {
              type: Sequelize.UUID,
              references: {
                model: 'application_status',
                key: 'id',
              },
              allowNull: false,
            },
            mode_of_delivery_id: {
              type: Sequelize.UUID,
              references: {
                model: 'mode_of_delivery',
                key: 'id',
              },
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
        queryInterface.dropTable('application', { transaction: t }),
      ])
    })
  },
}
