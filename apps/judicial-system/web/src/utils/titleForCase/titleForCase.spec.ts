import {
  Case,
  CaseState,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { createFormatMessage } from '../testHelpers.logic'
import { titleForCase } from './titleForCase'

describe('titleForCase', () => {
  const formatMessage = createFormatMessage()
  const fn = (theCase: Case) => titleForCase(formatMessage, theCase)

  test('should handle rejected investigation case', () => {
    const theCase = {
      state: CaseState.REJECTED,
      type: CaseType.BODY_SEARCH,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Kröfu um rannsóknarheimild hafnað')
  })

  test('should handle rejected restriction case', () => {
    const theCase = {
      state: CaseState.REJECTED,
      type: CaseType.CUSTODY,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Kröfu hafnað')
  })

  test('should handle dismissed case', () => {
    const theCase = { state: CaseState.DISMISSED } as Case
    const res = fn(theCase)
    expect(res).toEqual('Kröfu vísað frá')
  })

  test('should handle custody case with valid to date in past', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.CUSTODY,
      isValidToDateInThePast: true,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Gæsluvarðhaldi lokið')
  })

  test('should handle admission case with valid to date in past', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.ADMISSION_TO_FACILITY,
      isValidToDateInThePast: true,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Vistun á viðeigandi stofnun lokið')
  })

  test('should handle travel ban case with valid to date in past', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.TRAVEL_BAN,
      isValidToDateInThePast: true,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Farbanni lokið')
  })

  test('should handle accepted investigation case', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.SEARCH_WARRANT,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Krafa um rannsóknarheimild samþykkt')
  })

  test('should handle active custody case', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.CUSTODY,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Gæsluvarðhald virkt')
  })

  test('should handle active admission case', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.ADMISSION_TO_FACILITY,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Vistun á viðeigandi stofnun virk')
  })

  test('should handle active travel case', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.TRAVEL_BAN,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Farbann virkt')
  })

  test('should handle investigation case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.SEARCH_WARRANT,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Krafa um rannsóknarheimild')
  })

  test('should handle extended investigation case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.SEARCH_WARRANT,
      parentCase: {},
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Krafa um framlengingu á rannsóknarheimild')
  })

  test('should handle custody case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.CUSTODY,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Krafa um gæsluvarðhald')
  })

  test('should handle extended custody case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.CUSTODY,
      parentCase: {},
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Krafa um framlengingu á gæsluvarðhaldi')
  })

  test('should handle admission case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.ADMISSION_TO_FACILITY,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Krafa um vistun á viðeigandi stofnun')
  })

  test('should handle extended admission case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.ADMISSION_TO_FACILITY,
      parentCase: {},
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Krafa um framlengingu á vistun á viðeigandi stofnun')
  })

  test('should handle travel case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.TRAVEL_BAN,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Krafa um farbann')
  })

  test('should handle extended travel case in progress', () => {
    const theCase = {
      state: CaseState.NEW,
      type: CaseType.TRAVEL_BAN,
      parentCase: {},
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Krafa um framlengingu á farbanni')
  })
})
