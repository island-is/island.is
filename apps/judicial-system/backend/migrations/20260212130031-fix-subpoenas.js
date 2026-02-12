'use strict'

/**
 * Format: [subpoenaId, ...]
 */
const SUBPOENA_UPDATES = [
  '40c8ae0f-1166-4d4e-8a0b-1902e4414de4',
  '93363269-22dc-45f1-bbf5-aec250abf258',
  '8c9387ef-d58d-4515-a231-017f692f5771',
  'ed9736bb-5252-4b0b-95a7-e8fea701352d',
  '04b8fcc6-29d3-436b-bc59-36f427205b46',
  '11f91f25-b474-4220-9baa-e2937724c14d',
  'eaa9c70a-000c-47bd-bb1f-34baae3e6d35',
  '07a8f414-dd51-4d32-8ed2-ad1b00aaf3c7',
  'd39d8057-1a7e-4d86-9844-98af6e3b2655',
  '4e61aaca-09df-4a06-8349-055c94ecaf6a',
  'a2c41b6e-a2dc-419f-9402-e51949c6cc5c',
]

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      const updatePromises = SUBPOENA_UPDATES.map((subpoenaId) => {
        return queryInterface.sequelize.query(
          `UPDATE "subpoena"
              SET "service_status" = null,
                  "service_date" = null,
                  "served_by" = null,
                  "comment" = null
              WHERE "id" = :subpoenaId`,
          {
            replacements: { subpoenaId },
            transaction,
          },
        )
      })

      return Promise.all(updatePromises)
    })
  },

  async down() {
    return Promise.resolve()
  },
}
