'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'UPDATE client ' +
      'SET allow_offline_access = true,' +
      'absolute_refresh_token_lifetime = 10*60*60,' + // 10 hours
      'sliding_refresh_token_lifetime = 15*60 ' + // 15 minutes
        "WHERE client_id='ids-admin'",
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'UPDATE client ' +
        'SET allow_offline_access = false,' +
        'absolute_refresh_token_lifetime = 2592000,' +
        'sliding_refresh_token_lifetime = 1296000 ' +
        "WHERE client_id='ids-admin'",
    )
  },
}
