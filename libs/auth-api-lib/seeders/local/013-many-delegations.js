/* eslint-disable local-rules/disallow-kennitalas */
'use strict'

/**
 * Gives one test persona enough incoming delegations to exercise the
 * "Veldu notanda" screen above the threshold where the search field and the
 * "Nýlega notað" list appear (more than 7 delegations).
 *
 * Log in as Gervimaður Færeyjar (0101302399) to get the long list.
 * Log in as Gervimaður útlönd (0101307789) to get the short list, which is the
 * unchanged screen — that persona only holds the single delegation seeded in
 * 006-delegations.js.
 *
 * Three things this seeder has to take care of, all of them easy to get wrong:
 *
 * 1. `client_delegation_types` and `api_scope_delegation_types` decide whether
 *    a delegation is visible at all. The migrations that backfill those tables
 *    run before the seeders, so on a fresh database they are empty and no
 *    delegation is returned no matter what the `delegation` table holds. The
 *    inserts below are guarded with ON CONFLICT so they are also safe on a
 *    database where the backfill did run.
 *
 * 2. Individuals must resolve in the national registry. When a lookup returns
 *    nothing, AliveStatusService treats the person as deceased and ids-api
 *    DELETES the delegation on first read. So the individuals here are real
 *    Gervimaður test personas only — do not invent kennitölur for people.
 *    Companies are always treated as alive, and their name falls back to
 *    `from_display_name`, so invented company kennitölur are safe as long as
 *    they pass kennitala.isCompany() (every one below does).
 *
 * 3. `delegation` is unique on (domain_name, from_national_id, to_national_id),
 *    so this only inserts parties that are not already delegating to the persona.
 *    That keeps it usable on a database restored from a dump, not just a fresh one.
 *
 * 4. `delegation_scope.valid_from` is compared against the START of today, not
 *    the current time, so `new Date()` would not be valid until tomorrow.
 *    A fixed past date is used instead.
 *
 * Real company delegations are procurations that come from RSK, which cannot be
 * seeded here — these are Custom and GeneralMandate delegations from company
 * kennitölur, which is enough to render the "Fyrirtæki" group.
 */

const TO_NATIONAL_ID = '0101302399'
const TO_NAME = 'Gervimaður Færeyjar'

// Delegations are only valid from the start of the day, so this must be in the past.
const VALID_FROM = new Date('2024-01-01T00:00:00.000Z')

// Real Gervimaður personas — these resolve in the national registry.
const individuals = [
  {
    id: 'a7c4d101-0000-4000-8000-000000000001',
    nationalId: '0101303019',
    name: 'Gervimaður Afríka',
    scopes: ['@island.is/applications:read'],
  },
  {
    id: 'a7c4d102-0000-4000-8000-000000000002',
    nationalId: '0101302129',
    name: 'Gervimaður Noregur',
    scopes: ['@island.is/applications:read', '@island.is/documents'],
  },
  {
    id: 'a7c4d103-0000-4000-8000-000000000003',
    nationalId: '0101302989',
    name: 'Gervimaður Ameríka',
    scopes: ['@island.is/documents'],
  },
]

// Company kennitölur, all verified with kennitala.isCompany() and isValid().
// `scopes: null` means the delegation is a GeneralMandate (Allsherjarumboð).
const companies = [
  {
    id: 'a7c4d104-0000-4000-8000-000000000004',
    nationalId: '5005101370',
    name: '65° ARTIC ehf.',
    scopes: ['@island.is/applications:read'],
  },
  {
    id: 'a7c4d105-0000-4000-8000-000000000005',
    nationalId: '4703013920',
    name: 'Blámi fjárfestingafélag ehf.',
    scopes: ['@island.is/applications:read'],
  },
  {
    id: 'a7c4d106-0000-4000-8000-000000000006',
    nationalId: '6102032050',
    name: 'Dvergasteinn verk ehf.',
    scopes: ['@island.is/applications:read'],
  },
  {
    id: 'a7c4d107-0000-4000-8000-000000000007',
    nationalId: '5506122080',
    name: 'Eldfell ráðgjöf ehf.',
    scopes: null,
  },
  {
    id: 'a7c4d108-0000-4000-8000-000000000008',
    nationalId: '6904112020',
    name: 'Fjallabak hönnun ehf.',
    scopes: ['@island.is/applications:read'],
  },
  {
    id: 'a7c4d109-0000-4000-8000-000000000009',
    nationalId: '4312982019',
    name: 'Grænahlíð fasteignir hf.',
    scopes: null,
  },
  {
    id: 'a7c4d110-0000-4000-8000-000000000010',
    nationalId: '5209172090',
    name: 'Hafgerði útgerð ehf.',
    scopes: ['@island.is/applications:read'],
  },
  {
    id: 'a7c4d111-0000-4000-8000-000000000011',
    nationalId: '6403152020',
    name: 'Iðunn hugbúnaður ehf.',
    scopes: ['@island.is/applications:read'],
  },
  {
    id: 'a7c4d112-0000-4000-8000-000000000012',
    nationalId: '5502082020',
    name: 'Jökulsá verktakar ehf.',
    scopes: ['@island.is/applications:read'],
  },
  {
    id: 'a7c4d113-0000-4000-8000-000000000013',
    nationalId: '4701192090',
    name: 'Kaldbakur rekstur ehf.',
    scopes: null,
  },
  {
    id: 'a7c4d114-0000-4000-8000-000000000014',
    nationalId: '6010132070',
    name: 'Lindarhvoll eignir ehf.',
    scopes: ['@island.is/applications:read'],
  },
  {
    id: 'a7c4d115-0000-4000-8000-000000000015',
    nationalId: '6905062030',
    name: 'Mýrdalur ferðir ehf.',
    scopes: ['@island.is/applications:read'],
  },
  {
    id: 'a7c4d116-0000-4000-8000-000000000016',
    nationalId: '4310162060',
    name: 'Norðurljós miðlun ehf.',
    scopes: null,
  },
  {
    id: 'a7c4d117-0000-4000-8000-000000000017',
    nationalId: '5807092060',
    name: 'Ósland flutningar ehf.',
    scopes: ['@island.is/applications:read'],
  },
  {
    id: 'a7c4d118-0000-4000-8000-000000000018',
    nationalId: '6211042090',
    name: 'Reykjaból búrekstur ehf.',
    scopes: ['@island.is/applications:read'],
  },
  {
    id: 'a7c4d119-0000-4000-8000-000000000019',
    nationalId: '4908202050',
    name: 'Sandvík tækni ehf.',
    scopes: null,
  },
  {
    id: 'a7c4d120-0000-4000-8000-000000000020',
    nationalId: '6612212080',
    name: 'Tindafjöll orka ehf.',
    scopes: ['@island.is/applications:read'],
  },
]

const all = [...individuals, ...companies]

const toDelegationRow = (d) => ({
  id: d.id,
  from_national_id: d.nationalId,
  from_display_name: d.name,
  to_national_id: TO_NATIONAL_ID,
  to_name: TO_NAME,
})

// Scope ids get their own stable series so that re-running the seeder is a no-op.
const scopeId = (index) =>
  `b8d5e2${String(index).padStart(2, '0')}-0000-4000-8000-${String(
    index,
  ).padStart(12, '0')}`

const toScopeRows = (delegations) =>
  delegations
    .filter((d) => d.scopes)
    .flatMap((d) => d.scopes.map((scopeName) => ({ delegation: d, scopeName })))
    .map(({ delegation, scopeName }, index) => ({
      id: scopeId(index),
      delegation_id: delegation.id,
      scope_name: scopeName,
      valid_from: VALID_FROM,
    }))

const toGeneralMandateRows = (delegations) =>
  delegations
    .filter((d) => !d.scopes)
    .map((d) => ({
      delegation_id: d.id,
      delegation_type_id: 'GeneralMandate',
    }))

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.sequelize.query(
        `
        INSERT INTO client_delegation_types (client_id, delegation_type)
        VALUES
          ('@island.is/web', 'Custom'),
          ('@island.is/web', 'GeneralMandate'),
          ('@island.is/web', 'LegalGuardian'),
          ('@island.is/web', 'ProcurationHolder')
        ON CONFLICT DO NOTHING;

        INSERT INTO api_scope_delegation_types (api_scope_name, delegation_type)
        VALUES
          ('@island.is/applications:read', 'Custom'),
          ('@island.is/applications:read', 'LegalGuardian'),
          ('@island.is/applications:read', 'ProcurationHolder'),
          ('@island.is/documents', 'Custom'),
          ('@island.is/documents', 'LegalGuardian'),
          ('@island.is/documents', 'ProcurationHolder')
        ON CONFLICT DO NOTHING;
        `,
        { transaction },
      )

      // `unique_domain_from_to_index` is unique on (domain, from, to), so a party
      // that already delegates to the persona has to be left alone — inserting a
      // second row for it would either fail or, if ignored, orphan its scopes.
      const existing = await queryInterface.sequelize.query(
        `SELECT from_national_id FROM delegation
         WHERE to_national_id = :toNationalId AND domain_name IS NULL`,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { toNationalId: TO_NATIONAL_ID },
          transaction,
        },
      )
      const alreadyDelegating = new Set(
        existing.map((row) => row.from_national_id),
      )
      const missing = all.filter((d) => !alreadyDelegating.has(d.nationalId))

      console.log(
        `Seeding ${missing.length} delegations to ${TO_NAME} (${
          all.length - missing.length
        } already present, left untouched)`,
      )

      if (missing.length > 0) {
        await queryInterface.bulkInsert(
          'delegation',
          missing.map(toDelegationRow),
          { transaction },
        )

        const scopeRows = toScopeRows(missing)
        if (scopeRows.length > 0) {
          await queryInterface.bulkInsert('delegation_scope', scopeRows, {
            transaction,
          })
        }

        const generalMandateRows = toGeneralMandateRows(missing)
        if (generalMandateRows.length > 0) {
          await queryInterface.bulkInsert(
            'delegation_delegation_type',
            generalMandateRows,
            { transaction },
          )
        }
      }

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    const ids = all.map((d) => d.id)

    try {
      await queryInterface.bulkDelete(
        'delegation_delegation_type',
        { delegation_id: ids },
        { transaction },
      )
      await queryInterface.bulkDelete(
        'delegation_scope',
        { delegation_id: ids },
        { transaction },
      )
      await queryInterface.bulkDelete(
        'delegation',
        { id: ids },
        { transaction },
      )

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
