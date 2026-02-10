'use strict'

/**
 * Format: [[subpoenaId, policeSubpoenaId], ...]
 */
const SUBPOENA_UPDATES = [
  [
    '40c8ae0f-1166-4d4e-8a0b-1902e4414de4',
    '778d0713-8230-4582-8e75-d4f6c8fdc68f',
  ],
  [
    '93363269-22dc-45f1-bbf5-aec250abf258',
    '5e35fe3f-9b05-4eb7-bffc-78efd81b8e35',
  ],
  [
    '8c9387ef-d58d-4515-a231-017f692f5771',
    'd84318e5-3eda-4367-a0e2-510e79173535',
  ],
  [
    'ed9736bb-5252-4b0b-95a7-e8fea701352d',
    '0072be37-41d3-4076-9848-f41516ee26e8',
  ],
  [
    '04b8fcc6-29d3-436b-bc59-36f427205b46',
    'ad27580d-bce7-421c-bcbb-4bd51bcd889d',
  ],
  [
    '11f91f25-b474-4220-9baa-e2937724c14d',
    '76f2a01a-9e3d-4f91-b8f6-a77261b3562b',
  ],
  [
    'eaa9c70a-000c-47bd-bb1f-34baae3e6d35',
    'ec618b57-36e5-4abd-b80d-478a74f7509c',
  ],
  [
    '07a8f414-dd51-4d32-8ed2-ad1b00aaf3c7',
    'b9364832-db97-4f30-acdc-a2033e967aff',
  ],
  [
    'd39d8057-1a7e-4d86-9844-98af6e3b2655',
    '512bc1ec-b302-4089-8288-32e5d12409b6',
  ],
  [
    '4e61aaca-09df-4a06-8349-055c94ecaf6a',
    '6470a512-cd70-4dac-99b6-d1d898b588cc',
  ],
  [
    'a2c41b6e-a2dc-419f-9402-e51949c6cc5c',
    'f25d3b12-c7f5-4364-ae00-4aee5d415765',
  ],
]

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      const updatePromises = SUBPOENA_UPDATES.map(
        ([subpoenaId, policeSubpoenaId]) => {
          return queryInterface.sequelize.query(
            `UPDATE "subpoena"
           SET "police_subpoena_id" = :policeSubpoenaId
           WHERE "id" = :subpoenaId`,
            {
              replacements: {
                subpoenaId,
                policeSubpoenaId,
              },
              transaction,
            },
          )
        },
      )

      return Promise.all(updatePromises)
    })
  },

  async down(queryInterface) {
    return Promise.resolve()
  },
}
