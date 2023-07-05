'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable(
          'degree_type',
          {
            id: {
              type: Sequelize.UUID,
              primaryKey: true,
              allowNull: false,
              defaultValue: Sequelize.UUIDV4,
            },
            code: {
              type: Sequelize.STRING,
            },
            //TODO remove
            // name_is: {
            //   type: Sequelize.STRING,
            // },
            // name_en: {
            //   type: Sequelize.STRING,
            // },
          },
          { transaction: t },
        ),
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable('degree_type', { transaction: t }),
      ])
    })
  },
}
