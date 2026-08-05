'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "subpoena"
         SET "service_date" = :serviceDate,
             "comment" = :comment
         WHERE "id" = :subpoenaId`,
        {
          replacements: {
            serviceDate: '2026-06-19 19:52:00.000000+00',
            comment:
              'Lögreglumaður 9702 fór að Karlsstöðum og birti Ásmundi þann 19.júní 2026 kl.19:52. Ásmundur vildi ekki taka við pappírum né undirrita og sagðist ætla að verja sig sjálfur. Upplýsingaskýrsla liggur fyrir í málinu um þetta.',
            subpoenaId: '4efb1a54-1eaf-489e-b90e-39de4bacff61',
          },
          transaction,
        },
      ),
    )
  },

  async down() {
    return Promise.resolve()
  },
}
