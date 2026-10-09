import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  CaseState,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { createFormatMessage } from '@island.is/judicial-system-web/src/utils/testHelpers.logic'

import { titleForCase } from './titleForCase'

describe('titleForCase', () => {
  const formatMessage = createFormatMessage()
  const fn = (theCase: WorkingCase) => titleForCase(formatMessage, theCase)

  test('should handle rejected investigation case', () => {
    const theCase = {
      state: CaseState.REJECTED,
      type: CaseType.BODY_SEARCH,
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Kröfu um rannsóknarheimild hafnað')
  })

  test('should handle rejected restriction case', () => {
    const theCase = {
      state: CaseState.REJECTED,
      type: CaseType.CUSTODY,
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Kröfu hafnað')
  })

  test('should handle dismissed case', () => {
    const theCase = { state: CaseState.DISMISSED } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Kröfu vísað frá')
  })

  test('should handle custody case with valid to date in past', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.CUSTODY,
      isValidToDateInThePast: true,
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Gæsluvarðhaldi lokið')
  })

  test('should handle admission case with valid to date in past', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.ADMISSION_TO_FACILITY,
      isValidToDateInThePast: true,
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Vistun á viðeigandi stofnun lokið')
  })

  test('should handle travel ban case with valid to date in past', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.TRAVEL_BAN,
      isValidToDateInThePast: true,
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Farbanni lokið')
  })

  test('should handle accepted investigation case', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.SEARCH_WARRANT,
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Krafa um rannsóknarheimild samþykkt')
  })

  test('should handle active custody case', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.CUSTODY,
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Gæsluvarðhald virkt')
  })

  test('should handle active admission case', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.ADMISSION_TO_FACILITY,
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Vistun á viðeigandi stofnun virk')
  })

  test('should handle active travel case', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.TRAVEL_BAN,
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Farbann virkt')
  })

  test('should handle investigation case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.SEARCH_WARRANT,
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Krafa um rannsóknarheimild')
  })

  test('should handle extended investigation case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.SEARCH_WARRANT,
      parentCase: {},
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Krafa um framlengingu á rannsóknarheimild')
  })

  test('should handle custody case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.CUSTODY,
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Krafa um gæsluvarðhald')
  })

  test('should handle extended custody case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.CUSTODY,
      parentCase: {},
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Krafa um framlengingu á gæsluvarðhaldi')
  })

  test('should handle admission case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.ADMISSION_TO_FACILITY,
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Krafa um vistun á viðeigandi stofnun')
  })

  test('should handle extended admission case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.ADMISSION_TO_FACILITY,
      parentCase: {},
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Krafa um framlengingu á vistun á viðeigandi stofnun')
  })

  test('should handle travel case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.TRAVEL_BAN,
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Krafa um farbann')
  })

  test('should handle extended travel case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.TRAVEL_BAN,
      parentCase: {},
    } as WorkingCase
    const res = fn(theCase)
    expect(res).toEqual('Krafa um framlengingu á farbanni')
  })
})
