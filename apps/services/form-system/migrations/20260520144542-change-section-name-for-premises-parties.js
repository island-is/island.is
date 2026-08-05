'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
          UPDATE "section"
          SET
            "name" = '{"is": "Gagnaöflun", "en": "Data collection"}'::json,
            "modified" = CURRENT_TIMESTAMP
          WHERE "section_type" = 'PREMISES'
        `,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `
          UPDATE "section"
          SET
            "name" = '{"is": "Aðilar", "en": "Parties"}'::json,
            "modified" = CURRENT_TIMESTAMP
          WHERE "section_type" = 'PARTIES'
        `,
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
          UPDATE "section"
          SET
            "name" = '{"is": "Forsendur", "en": "Premises"}'::json,
            "modified" = CURRENT_TIMESTAMP
          WHERE "section_type" = 'PREMISES'
        `,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `
          UPDATE "section"
          SET
            "name" = '{"is": "Hlutaðeigandi aðilar", "en": "Relevant parties"}'::json,
            "modified" = CURRENT_TIMESTAMP
          WHERE "section_type" = 'PARTIES'
        `,
        { transaction },
      )
    })
  },
}
