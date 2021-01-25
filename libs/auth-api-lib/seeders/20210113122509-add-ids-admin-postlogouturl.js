'use strict'

const client_id = 'ids-admin'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('client_post_logout_redirect_uri', [
      {
        client_id: client_id,
        redirect_uri: 'http://localhost:4200',
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('client_post_logout_redirect_uri', {
      client_id: client_id,
      redirect_uri: 'http://localhost:4200',
    })
  },
}
