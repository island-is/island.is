'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("UPDATE client SET national_id = '5501692829', client_type = 'spa' WHERE client_id IN ('island-is-client-cred-1', 'island-is-1', 'postman',  'apex-auth_client')");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("UPDATE client SET national_id = null, client_type = null WHERE client_id IN ('island-is-client-cred-1', 'island-is-1', 'postman',  'apex-auth_client')");
  },
}
