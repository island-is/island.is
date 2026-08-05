'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `
          ALTER TABLE "client_claim"
          DROP CONSTRAINT "client_claim_pkey"
        `,
        { transaction: t },
      )

      await queryInterface.sequelize.query(
        `
          ALTER TABLE "client_claim"
          ADD CONSTRAINT "client_claim_pkey" PRIMARY KEY ("client_id", "type")
        `,
        { transaction: t },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `
          ALTER TABLE "client_claim"
          DROP CONSTRAINT "client_claim_pkey"
        `,
        { transaction: t },
      )

      await queryInterface.sequelize.query(
        `
          ALTER TABLE "client_claim"
          ADD CONSTRAINT "client_claim_pkey" PRIMARY KEY ("client_id", "value")
        `,
        { transaction: t },
      )
    })
  },
}
