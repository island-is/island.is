'use strict'

const {
  development: { userSeed },
} = require('../sequelize.config.js')

module.exports = {
  up: (queryInterface, Sequelize) => {
    var model = queryInterface.sequelize.define('user', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      created: Sequelize.DATE,
      updated: Sequelize.DATE,
      national_id: Sequelize.STRING,
      name: Sequelize.STRING,
      mobile_number: Sequelize.STRING,
      role: Sequelize.STRING,
    })

    return Promise.all(
      userSeed.map((user) =>
        queryInterface.upsert(
          'user',
          {
            ...user,
            created: new Date(),
            modified: new Date(),
          },
          {
            ...user,
            modified: new Date(),
          },
          { id: user.id },
          model,
          {},
        ),
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user', null, { transaction: t })
  },
}
