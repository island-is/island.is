'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('idp_restrictions', [
      {
        name: 'app',
        description: 'Mobile App',
        helptext: 'Allows users to login with mobile app',
        level: 4,
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('idp_restrictions', {
      name: 'app',
    })
  },
}
