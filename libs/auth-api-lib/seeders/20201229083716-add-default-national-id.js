'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      "UPDATE api_resource SET national_id = '5501692829' WHERE name IN ('swagger_api', 'postman_resource', 'api_resource')",
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      "UPDATE api_resource SET national_id = null WHERE name IN ('swagger_api', 'postman_resource', 'api_resource')",
    )
  },
}
