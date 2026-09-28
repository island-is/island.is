import type { User } from '@island.is/judicial-system/types'
import {
  caseTables,
  CaseTableType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

/**
 * What a case table fetches must depend only on that table.
 *
 * The cell generators are module level constants and the include machinery
 * merges into whatever object it is handed, so an include that is aliased
 * rather than copied ends up carrying another table's attributes and joins for
 * the lifetime of the process. Nothing about that is visible in one request:
 * the first list a process serves is correct and every later one drifts.
 *
 * It is not only a matter of fetching too much. getIncludeAndOrder pushes a
 * nested include's sort term ahead of its parent's, and that array is the whole
 * `order` of the query, so a leaked nested join prepends a primary sort key and
 * the same rows come back in a different order.
 */
describe('case table includes are isolated from each other', () => {
  const users: Record<string, User> = {
    publicProsecutor: {
      id: 'public_prosecutor_id',
      role: UserRole.PROSECUTOR,
      institution: {
        id: 'public_prosecutors_office_id',
        type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
      },
    } as User,
    districtCourtJudge: {
      id: 'judge_id',
      role: UserRole.DISTRICT_COURT_JUDGE,
      institution: {
        id: 'district_court_id',
        type: InstitutionType.DISTRICT_COURT,
      },
    } as User,
    courtOfAppealsJudge: {
      id: 'coa_judge_id',
      role: UserRole.COURT_OF_APPEALS_JUDGE,
      institution: {
        id: 'court_of_appeals_id',
        type: InstitutionType.COURT_OF_APPEALS,
      },
    } as User,
    defender: {
      id: 'defender_id',
      role: UserRole.DEFENDER,
      nationalId: '1111111111',
    } as User,
  }

  const allTableTypes = Object.values(CaseTableType)
  const userEntries = Object.entries(users)

  // Model classes are functions, which JSON.stringify drops - and dropping them
  // would hide exactly the nested joins this spec is looking for.
  //
  // It cannot see a `where`, which is built from Sequelize operator symbols and
  // serializes as {}. That is the one thing a leak here could carry which this
  // oracle would miss; no cell generator declares one today.
  const serialize = (value: unknown) =>
    JSON.stringify(value, (_key, inner) =>
      typeof inner === 'function' ? `[model ${inner.name}]` : inner,
    )

  // The shape caseTable.service builds a row query in: the table's own where
  // options first, then its columns. Not an empty object - with the real where
  // options a fresh literal occupies the slot first and partly shields the
  // generator behind it, so this is the harder case to keep isolated, not an
  // easier one.
  const buildOne = (
    results: Map<string, string>,
    tableType: CaseTableType,
    userName: string,
    user: User,
  ) => {
    const { getAllIncludes } = require('./caseTable.utils')
    const { caseTableWhereOptions } = require('./caseTable.whereOptions')

    let built: string

    try {
      const whereOptions = caseTableWhereOptions[tableType](user)

      built = serialize(
        getAllIncludes(
          whereOptions.includes ?? {},
          caseTables[tableType].columnKeys,
          user,
        ),
      )
    } catch (error) {
      built = `threw: ${(error as Error).message}`
    }

    results.set(`${tableType} ${userName}`, built)
  }

  /**
   * `perBuild` gives every build its own module registry, so each one is the
   * first build that registry has seen and cannot have been contaminated by
   * another. That is the baseline: what each list should fetch.
   *
   * Without it every build shares one registry, which is what a running process
   * does - one pod serving every list in turn.
   */
  const buildAll = (perBuild: boolean) => {
    const results = new Map<string, string>()

    if (perBuild) {
      for (const tableType of allTableTypes) {
        for (const [userName, user] of userEntries) {
          jest.isolateModules(() =>
            buildOne(results, tableType, userName, user),
          )
        }
      }

      return results
    }

    jest.isolateModules(() => {
      for (const tableType of allTableTypes) {
        for (const [userName, user] of userEntries) {
          buildOne(results, tableType, userName, user)
        }
      }
    })

    return results
  }

  // The invariant, stated directly. Comparing a list built in a fresh process
  // against the same list built by a process that has already served every
  // other list is the only comparison that can see a leak at all: isolate both
  // sides and every build is a first build, which is contaminated by nothing
  // whether or not the copying works.
  it('serves a list the same whether or not other lists were served first', () => {
    const isolated = buildAll(true)
    const sequential = buildAll(false)

    for (const [key, value] of isolated) {
      expect([key, sequential.get(key)]).toEqual([key, value])
    }
  })

  // The comparison above means nothing if the builds produced no include trees
  // to compare, or the same tree for everything.
  it('builds real and distinct include trees to compare', () => {
    const isolated = buildAll(true)
    const threw = [...isolated.entries()].filter(([, value]) =>
      value.startsWith('threw:'),
    )

    expect(threw).toEqual([])
    expect(isolated.size).toBe(allTableTypes.length * userEntries.length)
    expect(
      isolated.get(
        `${CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_IN_REVIEW} publicProsecutor`,
      ),
    ).not.toEqual(
      isolated.get(
        `${CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED} publicProsecutor`,
      ),
    )
  })

  // Names the cause the test above measures the effect of. On its own registry,
  // because the tests above have already built includes from the generators
  // this file imported; snapshotting those would compare a mutated state
  // against itself and pass either way.
  it('leaves the cell generators as they were declared', () => {
    jest.isolateModules(() => {
        const { caseTableCellGenerators } = require('./caseTable.cellGenerators')
      const { getAllIncludes } = require('./caseTable.utils')
      const { caseTableWhereOptions } = require('./caseTable.whereOptions')
  
      const before = serialize(caseTableCellGenerators)

      for (const tableType of allTableTypes) {
        for (const [, user] of userEntries) {
          try {
            getAllIncludes(
              caseTableWhereOptions[tableType](user).includes ?? {},
              caseTables[tableType].columnKeys,
              user,
            )
          } catch {
            // Only the generators matter here; a table a role cannot reach
            // still must not be able to write into them.
          }
        }
      }

      expect(serialize(caseTableCellGenerators)).toEqual(before)
    })
  })
})
