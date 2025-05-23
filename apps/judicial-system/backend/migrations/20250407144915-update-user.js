'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize
      .transaction((transaction) =>
        queryInterface
          .changeColumn(
            'user',
            'role',
            { type: Sequelize.STRING, allowNull: false },
            { transaction },
          )
          .then(() =>
            queryInterface.sequelize.query('DROP TYPE "enum_user_role"', {
              transaction,
            }),
          ),
      )
      .then(() =>
        Promise.all([
          queryInterface.removeConstraint(
            'user',
            'unique_national_id_per_institution',
          ),
          queryInterface.addConstraint('user', {
            fields: ['national_id', 'role', 'institution_id'],
            type: 'unique',
            name: 'unique_national_id_and_role_per_institution',
          }),
        ]),
      )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize
      .transaction((transaction) =>
        queryInterface.changeColumn(
          'user',
          'role',
          {
            type: Sequelize.ENUM(
              'PROSECUTOR',
              'PROSECUTOR_REPRESENTATIVE',
              'PUBLIC_PROSECUTOR_STAFF',
              'DISTRICT_COURT_JUDGE',
              'DISTRICT_COURT_REGISTRAR',
              'DISTRICT_COURT_ASSISTANT',
              'COURT_OF_APPEALS_JUDGE',
              'COURT_OF_APPEALS_REGISTRAR',
              'COURT_OF_APPEALS_ASSISTANT',
              'PRISON_SYSTEM_STAFF',
            ),
            allowNull: false,
          },
          { transaction },
        ),
      )
      .then(() =>
        Promise.all([
          queryInterface.removeConstraint(
            'user',
            'unique_national_id_and_role_per_institution',
          ),
          queryInterface.addConstraint('user', {
            fields: ['national_id', 'institution_id'],
            type: 'unique',
            name: 'unique_national_id_per_institution',
          }),
        ]),
      )
  },
}
