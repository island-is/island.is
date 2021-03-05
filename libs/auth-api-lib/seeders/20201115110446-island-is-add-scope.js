'use strict'
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */

module.exports = {
  up: (queryInterface) => {
    return Promise.resolve([1])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve([1])
  },
}
