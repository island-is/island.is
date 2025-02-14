import { IndictmentCountOffense } from '@island.is/judicial-system/types'
import { IndictmentSubtype } from '@island.is/judicial-system/types'
import { Offense } from '@island.is/judicial-system-web/src/graphql/schema'
import { formatMessage } from '@island.is/judicial-system-web/src/utils/testHelpers'

import { getIncidentDescription } from './getIncidentDescription'

describe('getIncidentDescription', () => {
  test('should return an empty string if there are no offenses in traffic violations', () => {
    const result = getIncidentDescription({
      indictmentCount: {
        id: 'testId',
        offenses: [],
        policeCaseNumber: '123-123-123',
      },
      formatMessage,
      crimeScene: {},
      subtypesRecord: { '123-123-123': [IndictmentSubtype.TRAFFIC_VIOLATION] },
    })

    expect(result).toBe('')
  })

  test('should return an empty string if deprecatedOffenses are missing in traffic violations', () => {
    const result = getIncidentDescription({
      indictmentCount: { id: 'testId', policeCaseNumber: '123-123-123' },
      formatMessage,
      crimeScene: {},
      subtypesRecord: { '123-123-123': [IndictmentSubtype.TRAFFIC_VIOLATION] },
    })

    expect(result).toBe('')
  })

  test('should return a description for only traffic violations', () => {
    const result = getIncidentDescription({
      indictmentCount: {
        id: 'testId',
        offenses: [
          { offense: IndictmentCountOffense.DRUNK_DRIVING },
        ] as Offense[],
        policeCaseNumber: '123-123-123',
      },
      formatMessage,
      crimeScene: {},
      subtypesRecord: { '123-123-123': [IndictmentSubtype.TRAFFIC_VIOLATION] },
    })

    expect(result).toBe(
      'fyrir umferðarlagabrot með því að hafa, [Dagsetning], ekið bifreiðinni [Skráningarnúmer ökutækis] undir áhrifum áfengis um [Vettvangur], þar sem lögregla stöðvaði aksturinn.',
    )
  })

  test('should return a description for a single subtype that is not a traffic violation', () => {
    const result = getIncidentDescription({
      indictmentCount: {
        id: 'testId',
        policeCaseNumber: '123-123-123',
      },
      formatMessage,
      crimeScene: {},
      subtypesRecord: { '123-123-123': [IndictmentSubtype.CUSTOMS_VIOLATION] },
    })

    expect(result).toBe('fyrir [tollalagabrot] með því að hafa, [Dagsetning]')
  })

  test('should return a description when there are multiple subtypes but only traffic violation is selected', () => {
    const result = getIncidentDescription({
      indictmentCount: {
        id: 'testId',
        policeCaseNumber: '123-123-123',
        offenses: [
          { offense: IndictmentCountOffense.DRUNK_DRIVING },
        ] as Offense[],
        indictmentCountSubtypes: [IndictmentSubtype.TRAFFIC_VIOLATION],
      },
      formatMessage,
      crimeScene: {},
      subtypesRecord: {
        '123-123-123': [
          IndictmentSubtype.CUSTOMS_VIOLATION,
          IndictmentSubtype.TRAFFIC_VIOLATION,
        ],
      },
    })

    expect(result).toBe(
      'fyrir umferðarlagabrot með því að hafa, [Dagsetning], ekið bifreiðinni [Skráningarnúmer ökutækis] undir áhrifum áfengis um [Vettvangur], þar sem lögregla stöðvaði aksturinn.',
    )
  })

  test('should return a description when there are multiple subtypes and all are selected', () => {
    const result = getIncidentDescription({
      indictmentCount: {
        id: 'testId',
        policeCaseNumber: '123-123-123',
        offenses: [
          { offense: IndictmentCountOffense.DRUNK_DRIVING },
        ] as Offense[],
        indictmentCountSubtypes: [
          IndictmentSubtype.CUSTOMS_VIOLATION,
          IndictmentSubtype.THEFT,
        ],
      },
      formatMessage,
      crimeScene: {},
      subtypesRecord: {
        '123-123-123': [
          IndictmentSubtype.CUSTOMS_VIOLATION,
          IndictmentSubtype.THEFT,
        ],
      },
    })

    expect(result).toBe(
      'fyrir [tollalagabrot, þjófnaður] með því að hafa, [Dagsetning]',
    )
  })

  test('should return the traffic violation description when there are multiple subtypes, all are selected and one is a traffic violation', () => {
    const result = getIncidentDescription({
      indictmentCount: {
        id: 'testId',
        policeCaseNumber: '123-123-123',
        offenses: [
          { offense: IndictmentCountOffense.DRUNK_DRIVING },
        ] as Offense[],
        indictmentCountSubtypes: [
          IndictmentSubtype.CUSTOMS_VIOLATION,
          IndictmentSubtype.TRAFFIC_VIOLATION,
        ],
      },
      formatMessage,
      crimeScene: {},
      subtypesRecord: {
        '123-123-123': [
          IndictmentSubtype.CUSTOMS_VIOLATION,
          IndictmentSubtype.TRAFFIC_VIOLATION,
        ],
      },
    })

    expect(result).toBe(
      'fyrir umferðarlagabrot með því að hafa, [Dagsetning], ekið bifreiðinni [Skráningarnúmer ökutækis] undir áhrifum áfengis um [Vettvangur], þar sem lögregla stöðvaði aksturinn.',
    )
  })
})
