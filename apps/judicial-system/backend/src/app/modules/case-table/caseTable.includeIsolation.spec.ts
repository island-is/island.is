import type { User } from '@island.is/judicial-system/types'
import {
  caseTables,
  CaseTableType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import { getAllIncludes } from './caseTable.utils'

/**
 * What a case table fetches must depend only on that table.
 *
 * The cell generators are module level constants and the include machinery
 * merges into whatever object it is handed, so an include that is aliased
 * rather than copied ends up carrying another table's attributes and joins for
 * the lifetime of the process. Nothing about that is visible in a single
 * request: the first list to be built is correct, and every later one drifts.
 */
describe('case table includes are isolated from each other', () => {
  const user = {
    id: 'public_prosecutor_id',
    role: UserRole.PROSECUTOR,
    institution: {
      id: 'public_prosecutors_office_id',
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
    },
  } as User

  // Model classes are functions, which JSON.stringify drops - and dropping them
  // would hide exactly the nested joins this spec is looking for.
  const serialize = (value: unknown) =>
    JSON.stringify(value, (_key, inner) =>
      typeof inner === 'function' ? `[model ${inner.name}]` : inner,
    )

  const includesFor = (tableType: CaseTableType) =>
    serialize(getAllIncludes({}, caseTables[tableType].columnKeys, user))

  const allTableTypes = Object.values(CaseTableType)

  it('builds the same includes for a table whichever order the tables are built in', () => {
    const forwards = new Map(allTableTypes.map((t) => [t, includesFor(t)]))

    const backwards = new Map(
      [...allTableTypes].reverse().map((t) => [t, includesFor(t)]),
    )

    for (const tableType of allTableTypes) {
      expect([tableType, backwards.get(tableType)]).toEqual([
        tableType,
        forwards.get(tableType),
      ])
    }
  })

  // Without this the test above would pass on an implementation that returned
  // the same includes for everything, which is the other way to be independent
  // of order and not the one we want.
  it('does not build the same includes for every table', () => {
    expect(new Set(allTableTypes.map(includesFor)).size).toBeGreaterThan(1)
  })

  // On a fresh module registry, because the tests above have already built
  // includes from the generators this file imported. Snapshotting those would
  // compare a mutated state against itself and pass either way.
  it('leaves the cell generators as they were declared', () => {
    jest.isolateModules(() => {
      const { caseTableCellGenerators } = require('./caseTable.cellGenerators')
      const {
        getAllIncludes: freshGetAllIncludes,
      } = require('./caseTable.utils')

      const before = serialize(caseTableCellGenerators)

      allTableTypes.forEach((tableType) =>
        freshGetAllIncludes({}, caseTables[tableType].columnKeys, user),
      )

      expect(serialize(caseTableCellGenerators)).toEqual(before)
    })
  })
})
