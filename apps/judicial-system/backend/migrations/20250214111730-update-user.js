'use strict'

module.exports = {
  up(queryInterface) {
    return queryInterface.removeConstraint('user', 'user_national_id_key')
  },

  down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('user', 'national_id', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    })
  },
}
