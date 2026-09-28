'use strict'

// Lawyers that exist only for automated tests. Login requires a hit in the
// lawyer registry, and this is the national id the e2e defender logs in with.
// Keep in sync with src/app/modules/lawyer-registry/testLawyers.ts, which
// re-adds the same lawyers whenever the registry is replaced from LMFÍ.
const testLawyers = [
  {
    id: 'a9f3d0e2-6b1c-4f7e-9d2a-3c5b8e1f4a60',
    name: 'Test Verjandi',
    national_id: '0909090909',
    email: 'testverjandi@dummy.dd',
    phone_number: '0000000',
    practice: 'Test Lögmannsstofa',
    is_litigator: true,
  },
]

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      // The registry is replaced wholesale from LMFÍ, so a previous copy of a
      // test lawyer may exist under a different id - replace by national id
      // rather than upserting by id to avoid duplicates.
      await queryInterface.bulkDelete(
        'lawyer_registry',
        { national_id: testLawyers.map((lawyer) => lawyer.national_id) },
        { transaction: t },
      )

      await queryInterface.bulkInsert(
        'lawyer_registry',
        testLawyers.map((lawyer) => ({
          ...lawyer,
          created: new Date(),
          modified: new Date(),
        })),
        { transaction: t },
      )
    })
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkDelete(
        'lawyer_registry',
        { national_id: testLawyers.map((lawyer) => lawyer.national_id) },
        { transaction: t },
      ),
    )
  },
}
