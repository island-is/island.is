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

    return queryInterface.sequelize.transaction((t) =>
      Promise.all(
        userSeed.map((user) =>
          queryInterface.upsert(
            'user',
            {
              ...user,
              created: new Date(),
              modified: new Date(),
            },
            user,
            { id: user.id },
            model,
            { transaction: t },
          ),
        ),
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkDelete('user', null, { transaction: t }),
    )
  },
}
