'use strict'
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-undef */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('idp_providers', [
      {
        name: 'app',
        description: 'Mobile App',
        helptext: 'Allows users to login with mobile app',
        level: 4,
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('idp_providers', {
      name: 'app',
    })
  },
}
