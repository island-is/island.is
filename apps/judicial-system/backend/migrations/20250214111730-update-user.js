'use strict'

module.exports = {
  up(queryInterface) {
    return Promise.all([
      queryInterface.removeConstraint('user', 'user_national_id_key'),
      queryInterface.addConstraint('user', {
        fields: ['national_id', 'institution_id'],
        type: 'unique',
        name: 'unique_national_id_per_institution',
      }),
    ])
  },

  down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('user', 'national_id', {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      }),
      queryInterface.removeConstraint(
        'user',
        'unique_national_id_per_institution',
      ),
    ])
  },
}
