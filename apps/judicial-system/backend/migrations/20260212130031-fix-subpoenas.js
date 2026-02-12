'use strict'

/**
 * Format: [[subpoenaId, policeSubpoenaId, serviceDate, serviceStatus, comment], ...]
 */
const SUBPOENA_UPDATES = [
  [
    '40c8ae0f-1166-4d4e-8a0b-1902e4414de4',
    '778d0713-8230-4582-8e75-d4f6c8fdc68f',
    '2026-02-04 15:46:02.000000+00',
    'ELECTRONICALLY',
    'Birting tókst í gegnum island.is',
  ],
  [
    '93363269-22dc-45f1-bbf5-aec250abf258',
    '5e35fe3f-9b05-4eb7-bffc-78efd81b8e35',
    '2026-02-04 14:45:58.000000+00',
    'ELECTRONICALLY',
    'Birting tókst í gegnum island.is',
  ],
  [
    '8c9387ef-d58d-4515-a231-017f692f5771',
    'd84318e5-3eda-4367-a0e2-510e79173535',
    '2026-02-04 18:48:27.000000+00',
    'ELECTRONICALLY',
    'Birting tókst í gegnum island.is',
  ],
  [
    'ed9736bb-5252-4b0b-95a7-e8fea701352d',
    '0072be37-41d3-4076-9848-f41516ee26e8',
    '2026-02-04 17:57:09.000000+00',
    'ELECTRONICALLY',
    'Birting tókst í gegnum island.is',
  ],
  [
    '04b8fcc6-29d3-436b-bc59-36f427205b46',
    'ad27580d-bce7-421c-bcbb-4bd51bcd889d',
    '2026-02-04 14:34:30.000000+00',
    'ELECTRONICALLY',
    'Birting tókst í gegnum island.is',
  ],
  [
    '11f91f25-b474-4220-9baa-e2937724c14d',
    '76f2a01a-9e3d-4f91-b8f6-a77261b3562b',
    '2026-02-04 14:09:57.000000+00',
    'ELECTRONICALLY',
    'Birting tókst í gegnum island.is',
  ],
  [
    '4e61aaca-09df-4a06-8349-055c94ecaf6a',
    '6470a512-cd70-4dac-99b6-d1d898b588cc',
    '2026-02-03 16:06:07.000000+00',
    'ELECTRONICALLY',
    'Birting tókst í gegnum island.is',
  ],
  [
    'a2c41b6e-a2dc-419f-9402-e51949c6cc5c',
    'f25d3b12-c7f5-4364-ae00-4aee5d415765',
    '2026-02-03 14:06:11.000000+00',
    'ELECTRONICALLY',
    'Birting tókst í gegnum island.is',
  ],
]

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      const updatePromises = SUBPOENA_UPDATES.map(
        ([
          subpoenaId,
          policeSubpoenaId,
          serviceDate,
          serviceStatus,
          comment,
        ]) => {
          return queryInterface.sequelize.query(
            `UPDATE "subpoena"
              SET "police_subpoena_id" = :policeSubpoenaId,
                  "service_date" = :serviceDate,
                  "service_status" = :serviceStatus,
                  "served_by" = null,
                  "comment" = :comment
              WHERE "id" = :subpoenaId`,
            {
              replacements: {
                subpoenaId,
                policeSubpoenaId,
                serviceDate,
                serviceStatus,
                comment,
              },
              transaction,
            },
          )
        },
      )

      return Promise.all(updatePromises)
    })
  },

  async down() {
    return Promise.resolve()
  },
}
