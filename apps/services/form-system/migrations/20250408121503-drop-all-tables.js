'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropAllTables();

  },

  async down(queryInterface, Sequelize) {
    console.log('Reverting this migration is not supported.')
  }
};
