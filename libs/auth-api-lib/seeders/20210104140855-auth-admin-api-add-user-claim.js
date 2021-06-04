'use strict'
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-undef */

const api_resource_name = 'auth-admin-api'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.resolve([1])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve([1])
  },
}
