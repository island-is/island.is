import { createIntl } from 'react-intl'

import {
  Case,
  CaseDecision,
  CaseType,
  Defendant,
  Gender,
} from '@island.is/judicial-system/types'

import { getConclusionAutofill } from './Ruling'

describe('getConclusionAutofill', () => {
  const intl = createIntl({ locale: 'is', onError: () => jest.fn() })
  const autofill = (theCase: Case) =>
    getConclusionAutofill(intl.formatMessage, theCase)

  const defentantBase = {
    name: 'Blær',
    gender: Gender.OTHER,
    noNationalId: true,
  }

  describe('guards', () => {
    it('should return undefined when there is no defentants array', () => {
      const theCase = {
        decision: CaseDecision.DISMISSING,
        type: CaseType.CUSTODY,
      } as Case

      const result = autofill(theCase)

      expect(result).toBeUndefined()
    })

    it('should return undefined when defentants array is empty', () => {
      const theCase = {
        decision: CaseDecision.DISMISSING,
        defendants: [] as Defendant[],
        type: CaseType.CUSTODY,
      } as Case

      const result = autofill(theCase)

      expect(result).toBeUndefined()
    })

    it('should return undefined when decision is missing', () => {
      const theCase = {
        defendants: [{ ...defentantBase }],
        type: CaseType.CUSTODY,
      } as Case

      const result = autofill(theCase)

      expect(result).toBeUndefined()
    })

    it('should return undefined when conclusion is defined', () => {
      const theCase = {
        conclusion: 'some conclusion',
        decision: CaseDecision.DISMISSING,
        defendants: [{ ...defentantBase }],
        type: CaseType.CUSTODY,
      } as Case

      const result = autofill(theCase)

      expect(result).toBeUndefined()
    })

    it('should return undefined when conclusion is empty string', () => {
      const theCase = {
        conclusion: '',
        decision: CaseDecision.DISMISSING,
        defendants: [{ ...defentantBase }],
        type: CaseType.CUSTODY,
      } as Case

      const result = autofill(theCase)

      expect(result).toBeUndefined()
    })
  })

  describe('dismissing decision', () => {
    const baseCase = { decision: CaseDecision.DISMISSING } as Case

    it('should format custody case, non gender specific', () => {
      const theCase = {
        ...baseCase,
        defendants: [{ ...defentantBase }],
        type: CaseType.CUSTODY,
      } as Case

      const result = autofill(theCase)

      expect(result).toEqual(
        'Kröfu um að kærða, Blær, sæti gæsluvarðhaldi er vísað frá.',
      )
    })

    it('should format extended travel ban case, female gender', () => {
      const theCase = {
        ...baseCase,
        defendants: [{ ...defentantBase, gender: Gender.FEMALE }],
        type: CaseType.TRAVEL_BAN,
        parentCase: { decision: CaseDecision.ACCEPTING },
      } as Case

      const result = autofill(theCase)

      expect(result).toEqual(
        'Kröfu um að kærða, Blær, sæti áframhaldandi farbanni er vísað frá.',
      )
    })

    it('should format admission to facility case, male gender', () => {
      const theCase = {
        ...baseCase,
        defendants: [
          {
            ...defentantBase,
            gender: Gender.MALE,
            noNationalId: false,
            nationalId: '000000000',
          },
        ],
        type: CaseType.ADMISSION_TO_FACILITY,
      } as Case

      const result = autofill(theCase)

      expect(result).toEqual(
        'Kröfu um að kærði, Blær, sæti vistun á viðeigandi stofnun er vísað frá.',
      )
    })
  })

  describe('rejecting decision', () => {
    const baseCase = { decision: CaseDecision.REJECTING } as Case

    it('should format custody case, non gender specific', () => {
      const theCase = {
        ...baseCase,
        defendants: [{ ...defentantBase }],
        type: CaseType.CUSTODY,
      } as Case

      const result = autofill(theCase)

      expect(result).toEqual(
        'Kröfu um að kærða, Blær, sæti gæsluvarðhaldi er hafnað.',
      )
    })

    it('should format travel ban case, male with national id', () => {
      const theCase = {
        ...baseCase,
        defendants: [
          {
            ...defentantBase,
            gender: Gender.MALE,
            noNationalId: false,
            nationalId: '0000000000',
          },
        ],
        type: CaseType.CUSTODY,
      } as Case

      const result = autofill(theCase)

      expect(result).toEqual(
        'Kröfu um að kærði, Blær, kt. 000000-0000, sæti gæsluvarðhaldi er hafnað.',
      )
    })

    it('should format extended admission to facility case, male with national id', () => {
      const theCase = {
        ...baseCase,
        defendants: [
          { ...defentantBase, noNationalId: false, nationalId: '0000000000' },
        ],
        type: CaseType.ADMISSION_TO_FACILITY,
        parentCase: { decision: CaseDecision.ACCEPTING },
      } as Case

      const result = autofill(theCase)

      expect(result).toEqual(
        'Kröfu um að kærða, Blær, kt. 000000-0000, sæti áframhaldandi vistun á viðeigandi stofnun er hafnað.',
      )
    })
  })

  describe('accepting decision', () => {
    const baseCase = {
      decision: CaseDecision.ACCEPTING,
      validToDate: '2020-01-01T12:31:00Z',
    } as Case

    it('should format custody case', () => {
      const theCase = {
        ...baseCase,
        defendants: [{ ...defentantBase }],
        type: CaseType.CUSTODY,
      } as Case

      const result = autofill(theCase)

      expect(result).toEqual(
        'Kærða, Blær, skal sæta gæsluvarðhaldi, þó ekki lengur en til miðvikudagsins 1. janúar 2020, kl. 12:31.',
      )
    })

    it('should format custody case with isolation', () => {
      const theCase = {
        ...baseCase,
        defendants: [{ ...defentantBase }],
        type: CaseType.CUSTODY,
        isCustodyIsolation: true,
        isolationToDate: '2020-01-01T12:30:00Z',
      } as Case

      const result = autofill(theCase)

      expect(result).toEqual(
        'Kærða, Blær, skal sæta gæsluvarðhaldi, þó ekki lengur en til miðvikudagsins 1. janúar 2020, kl. 12:31. Kærða skal sæta einangrun ekki lengur en til miðvikudagsins 1. janúar 2020, kl. 12:30.',
      )
    })

    it('should format custody case as travel ban case', () => {
      const theCase = {
        ...baseCase,
        decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
        defendants: [{ ...defentantBase }],
        type: CaseType.CUSTODY,
      } as Case

      const result = autofill(theCase)

      expect(result).toEqual(
        'Kærða, Blær, skal sæta farbanni, þó ekki lengur en til miðvikudagsins 1. janúar 2020, kl. 12:31.',
      )
    })

    it('should format admission to facility case with isolation, male gender', () => {
      const theCase = {
        ...baseCase,
        defendants: [{ ...defentantBase, gender: Gender.MALE }],
        type: CaseType.ADMISSION_TO_FACILITY,
        isCustodyIsolation: true,
        isolationToDate: '2020-01-01T12:31:00Z',
      } as Case

      const result = autofill(theCase)

      expect(result).toEqual(
        'Kærði, Blær, skal sæta vistun á viðeigandi stofnun, þó ekki lengur en til miðvikudagsins 1. janúar 2020, kl. 12:31. Kærði skal sæta einangrun á meðan á vistunni stendur.',
      )
    })

    it('should format travel ban case, femail gender with national id', () => {
      const theCase = {
        ...baseCase,
        defendants: [
          {
            ...defentantBase,
            gender: Gender.FEMALE,
            noNationalId: false,
            nationalId: '0000000000',
          },
        ],
        type: CaseType.ADMISSION_TO_FACILITY,
        isCustodyIsolation: true,
        isolationToDate: '2020-01-01T12:31:00Z',
      } as Case

      const result = autofill(theCase)

      expect(result).toEqual(
        'Kærða, Blær, kt. 000000-0000, skal sæta vistun á viðeigandi stofnun, þó ekki lengur en til miðvikudagsins 1. janúar 2020, kl. 12:31. Kærða skal sæta einangrun á meðan á vistunni stendur.',
      )
    })

    it('should format as non extended travel ban case when case is an extended custody with accepcted alternative travel ban', () => {
      const theCase = {
        ...baseCase,
        decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
        defendants: [{ ...defentantBase, gender: Gender.MALE }],
        type: CaseType.CUSTODY,
        parentCase: { decision: CaseDecision.ACCEPTING } as Case,
      } as Case

      const result = autofill(theCase)

      expect(result).toEqual(
        'Kærði, Blær, skal sæta farbanni, þó ekki lengur en til miðvikudagsins 1. janúar 2020, kl. 12:31.',
      )
    })
  })
})
