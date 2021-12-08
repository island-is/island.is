'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.sequelize
          .query(
            'INSERT INTO "amount" ( "id", "final_amount", "application_id", "tax", "aid_amount", "personal_tax_credit") \
            SELECT md5(random()::text || clock_timestamp()::text)::uuid, "amount", "id", 0, 0, 0 \
            FROM    "applications" \
            WHERE "amount" IS NOT NULL',
            { transaction: t },
          )
          .then(() =>
            queryInterface.removeColumn('applications', 'amount', {
              transaction: t,
            }),
          ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'applications',
          'amount',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },
}
