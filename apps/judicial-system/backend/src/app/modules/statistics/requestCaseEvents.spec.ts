import {
  CaseLegalProvisions,
  CaseOrigin,
  CaseType,
} from '@island.is/judicial-system/types'

import { Case } from '../repository'
import { requestCaseEventFunctions } from './requestCaseEvents'

const createCaseEvent = requestCaseEventFunctions[0]

const makeCase = (
  type: CaseType,
  legalProvisions?: CaseLegalProvisions[],
): Case =>
  ({
    id: 'test-case-id',
    created: new Date('2026-09-01T10:00:00.000Z'),
    type,
    origin: CaseOrigin.RVG,
    legalProvisions,
  } as unknown as Case)

describe('requestCaseEvents legal provisions', () => {
  test('should list all checked legal provisions in canonical order', () => {
    // Arrange
    const theCase = makeCase(CaseType.CUSTODY, [
      CaseLegalProvisions._115_1_B,
      CaseLegalProvisions._95_1_A,
      CaseLegalProvisions._115_1,
    ])

    // Act
    const event = createCaseEvent(theCase)

    // Assert
    expect(event?.legalProvisions).toBe(
      'a-lið 1. mgr. 95. gr. sml., 115. gr. útl., b-lið 115. gr. útl.',
    )
  })

  test('should return an empty string when no legal provisions are checked', () => {
    // Arrange
    const theCase = makeCase(CaseType.CUSTODY)

    // Act
    const event = createCaseEvent(theCase)

    // Assert
    expect(event?.legalProvisions).toBe('')
  })

  test('should list legacy legal provisions', () => {
    // Arrange
    const theCase = makeCase(CaseType.TRAVEL_BAN, [
      CaseLegalProvisions._100_1,
      CaseLegalProvisions._95_1_B,
    ])

    // Act
    const event = createCaseEvent(theCase)

    // Assert
    expect(event?.legalProvisions).toBe(
      'b-lið 1. mgr. 95. gr. sml., 1. mgr. 100. gr. sml.',
    )
  })
})
