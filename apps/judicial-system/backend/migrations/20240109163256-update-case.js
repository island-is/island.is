'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .addColumn(
          'case',
          'prosecutors_office_id',
          {
            type: Sequelize.UUID,
            references: {
              model: 'institution',
              key: 'id',
            },
            allowNull: true,
          },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE "case"
           SET prosecutors_office_id="user".institution_id
           FROM "user"
           WHERE "user".id="case".creating_prosecutor_id`,
            { transaction },
          ),
        ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('case', 'prosecutors_office_id', {
        transaction,
      }),
    )
  },
}
