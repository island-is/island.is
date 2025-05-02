'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .changeColumn(
          'institution',
          'type',
          { type: Sequelize.STRING, allowNull: false },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query('DROP TYPE "enum_institution_type"', {
            transaction,
          }),
        )
        .then(() =>
          Promise.all([
            queryInterface.bulkUpdate(
              'institution',
              { type: 'DISTRICT_PROSECUTORS_OFFICE' },
              { id: 'fbbe0ebd-33f1-4a8f-84ba-8e4b8e8b16b1' },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              { type: 'PUBLIC_PROSECUTORS_OFFICE' },
              { id: '8f9e2f6d-6a00-4a5e-b39b-95fd110d762e' },
              { transaction },
            ),
          ]).then(() =>
            queryInterface.bulkUpdate(
              'institution',
              { type: 'POLICE_PROSECUTORS_OFFICE' },
              { type: 'PROSECUTORS_OFFICE' },
              { transaction },
            ),
          ),
        ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .bulkUpdate(
          'institution',
          { type: 'PROSECUTORS_OFFICE' },
          {
            type: [
              'POLICE_PROSECUTORS_OFFICE',
              'DISTRICT_PROSECUTORS_OFFICE',
              'PUBLIC_PROSECUTORS_OFFICE',
            ],
          },
          { transaction },
        )
        .then(() =>
          queryInterface.changeColumn(
            'institution',
            'type',
            {
              type: Sequelize.ENUM(
                'PROSECUTORS_OFFICE',
                'DISTRICT_COURT',
                'COURT_OF_APPEALS',
                'PRISON',
                'PRISON_ADMIN',
              ),
              allowNull: false,
            },
            { transaction },
          ),
        ),
    )
  },
}
