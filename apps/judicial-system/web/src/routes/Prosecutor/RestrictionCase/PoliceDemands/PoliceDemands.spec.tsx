import {
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { createFormatMessage } from '@island.is/judicial-system-web/src/utils/testHelpers.logic'

import { DemandsAutofillProps, getDemandsAutofill } from './PoliceDemands'

describe('getDemandsAutofill', () => {
  const baseDefendant = {
    name: 'Blær',
    noNationalId: false,
    nationalId: '0000000000',
  } as Defendant
  const courtName = 'Héraðsdómur'

  const formatMessage = createFormatMessage()
  const f = (props: DemandsAutofillProps): string => {
    return getDemandsAutofill(formatMessage, props)
  }

  it('should format custody case', () => {
    const props = {
      caseType: CaseType.CUSTODY,
      defendant: baseDefendant,
      type: CaseType.CUSTODY,
      courtName,
      requestedValidToDate: '2020-01-01',
    } as DemandsAutofillProps

    const result = f(props)

    expect(result).toEqual(
      'Þess er krafist að Blær, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms, til miðvikudagsins 1. janúar 2020, kl. 00:00.',
    )
  })

  it('should format extended custody case', () => {
    const props = {
      caseType: CaseType.CUSTODY,
      defendant: baseDefendant,
      type: CaseType.CUSTODY,
      courtName,
      requestedValidToDate: '2020-01-01',
      parentCaseDecision: CaseDecision.ACCEPTING,
    } as DemandsAutofillProps

    const result = f(props)

    expect(result).toEqual(
      'Þess er krafist að Blær, kt. 000000-0000, sæti áframhaldandi gæsluvarðhaldi með úrskurði Héraðsdóms, til miðvikudagsins 1. janúar 2020, kl. 00:00.',
    )
  })

  it('should format custody case with isolation', () => {
    const props = {
      caseType: CaseType.CUSTODY,
      defendant: baseDefendant,
      type: CaseType.CUSTODY,
      courtName,
      requestedValidToDate: '2020-01-01',
      requestedCustodyRestrictions: [CaseCustodyRestrictions.ISOLATION],
    } as DemandsAutofillProps

    const result = f(props)

    expect(result).toEqual(
      'Þess er krafist að Blær, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms, til miðvikudagsins 1. janúar 2020, kl. 00:00, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    )
  })

  it('should format travel ban case', () => {
    const props = {
      caseType: CaseType.TRAVEL_BAN,
      defendant: {
        ...baseDefendant,
        noNationalId: true,
        nationalId: '1991-01-01',
      },
      type: CaseType.CUSTODY,
      courtName,
      requestedValidToDate: '2020-01-01',
    } as DemandsAutofillProps

    const result = f(props)

    expect(result).toEqual(
      'Þess er krafist að Blær, fd. 1991-01-01, sæti farbanni með úrskurði Héraðsdóms, til miðvikudagsins 1. janúar 2020, kl. 00:00.',
    )
  })

  it('should format admission to facility case', () => {
    const props = {
      caseType: CaseType.ADMISSION_TO_FACILITY,
      defendant: baseDefendant,
      type: CaseType.CUSTODY,
      courtName,
      requestedValidToDate: '2020-01-01',
    } as DemandsAutofillProps

    const result = f(props)

    expect(result).toEqual(
      'Þess er krafist að Blær, kt. 000000-0000, sæti vistun á viðeigandi stofnun með úrskurði Héraðsdóms, til miðvikudagsins 1. janúar 2020, kl. 00:00.',
    )
  })
})
