'use strict'

// A verdict was mistakenly registered as published in Lögbirtingablaðið on
// 10 July 2026. It was never published there — it was served in person on
// 2 September 2026 at 09:50.
module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE verdict
         SET service_status = :serviceStatus,
             service_date = :serviceDate,
             served_by = :servedBy
         WHERE id = :verdictId
         AND service_status = 'LEGAL_PAPER'`,
        {
          replacements: {
            verdictId: 'a09894a6-aaa3-4818-a0bb-7d4f81aa5d37',
            serviceStatus: 'IN_PERSON',
            serviceDate: '2026-09-02 09:50:00.000000+00',
            servedBy: 'Anna Guðný Möller',
          },
          transaction,
        },
      ),
    )
  },

  down: () => Promise.resolve(),
}
