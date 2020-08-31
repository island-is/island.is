'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    var clients = null;
    return queryInterface.bulkInsert('clients', clients, {})
  },

  down: (queryInterface, Sequelize) => {

    var clients =  queryInterface.bulkDelete('clients', null, {});
    return Promise.all([clients])
  }
};
