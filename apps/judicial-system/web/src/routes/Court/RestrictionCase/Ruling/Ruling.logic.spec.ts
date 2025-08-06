import {
  Case,
  CaseDecision,
  CaseType,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { createFormatMessage } from '@island.is/judicial-system-web/src/utils/testHelpers.logic'

import { getConclusionAutofill } from './Ruling.logic'

describe('getConclusionAutofill', () => {
  const formatMessage = createFormatMessage()
  const defendantBase = {
    name: 'Blær',
    noNationalId: true,
  } as Defendant

  const fn = (
    theCase: Case,
    decision: CaseDecision,
    defendant = defendantBase,
    validToDate?: string,
    isCustodyIsolation = false,
    isolationToDate?: string,
  ) =>
    getConclusionAutofill(
      formatMessage,
      theCase,
      decision,
      defendant,
      validToDate,
      isCustodyIsolation,
      isolationToDate,
    )

  describe('dismissing decision', () => {
    const decision = CaseDecision.DISMISSING

    it('should format custody case', () => {
      const theCase = {
        defendants: [{ ...defendantBase }],
        type: CaseType.CUSTODY,
      } as Case

      const result = fn(theCase, decision)

      expect(result).toEqual(
        'Kröfu um að varnaraðili, Blær, sæti gæsluvarðhaldi er vísað frá.',
      )
    })

    it('should format extended travel ban case', () => {
      const theCase = {
        defendants: [{ ...defendantBase }],
        type: CaseType.TRAVEL_BAN,
        parentCase: { decision: CaseDecision.ACCEPTING },
      } as Case

      const result = fn(theCase, decision)

      expect(result).toEqual(
        'Kröfu um að varnaraðili, Blær, sæti áframhaldandi farbanni er vísað frá.',
      )
    })

    it('should format admission to facility case', () => {
      const defendant = {
        ...defendantBase,
        noNationalId: false,
        nationalId: '000000000',
      }

      const theCase = {
        type: CaseType.ADMISSION_TO_FACILITY,
      } as Case

      const result = fn(theCase, decision, defendant)

      expect(result).toEqual(
        'Kröfu um að varnaraðili, Blær, sæti vistun á viðeigandi stofnun er vísað frá.',
      )
    })
  })

  describe('rejecting decision', () => {
    const decision = CaseDecision.REJECTING

    it('should format custody case', () => {
      const theCase = {
        defendants: [{ ...defendantBase }],
        type: CaseType.CUSTODY,
      } as Case

      const result = fn(theCase, decision)

      expect(result).toEqual(
        'Kröfu um að varnaraðili, Blær, sæti gæsluvarðhaldi er hafnað.',
      )
    })

    it('should format travel ban case, defendant with national id', () => {
      const defendant = {
        ...defendantBase,
        noNationalId: false,
        nationalId: '0000000000',
      }
      const theCase = {
        type: CaseType.CUSTODY,
      } as Case

      const result = fn(theCase, decision, defendant)

      expect(result).toEqual(
        'Kröfu um að varnaraðili, Blær, kt. 000000-0000, sæti gæsluvarðhaldi er hafnað.',
      )
    })

    it('should format extended admission to facility case, defendant with date of birth', () => {
      const defendant = {
        ...defendantBase,
        noNationalId: true,
        nationalId: '1990-01-01',
      }
      const theCase = {
        type: CaseType.ADMISSION_TO_FACILITY,
        parentCase: { decision: CaseDecision.ACCEPTING },
      } as Case

      const result = fn(theCase, decision, defendant)

      expect(result).toEqual(
        'Kröfu um að varnaraðili, Blær, fd. 1990-01-01, sæti áframhaldandi vistun á viðeigandi stofnun er hafnað.',
      )
    })
  })

  describe('accepting decision', () => {
    const decision = CaseDecision.ACCEPTING
    const validToDate = '2020-01-01T12:31:00Z'

    it('should format custody case', () => {
      const theCase = {
        type: CaseType.CUSTODY,
      } as Case

      const result = fn(theCase, decision, defendantBase, validToDate)

      expect(result).toEqual(
        'Varnaraðili, Blær, skal sæta gæsluvarðhaldi, þó ekki lengur en til miðvikudagsins 1. janúar 2020, kl. 12:31.',
      )
    })

    it('should format custody case with isolation', () => {
      const isCustodyIsolation = true
      const isolationToDate = '2020-01-01T12:00:00Z'
      const theCase = {
        type: CaseType.CUSTODY,
      } as Case

      const result = fn(
        theCase,
        decision,
        defendantBase,
        validToDate,
        isCustodyIsolation,
        isolationToDate,
      )

      expect(result).toEqual(
        'Varnaraðili, Blær, skal sæta gæsluvarðhaldi, þó ekki lengur en til miðvikudagsins 1. janúar 2020, kl. 12:31. Varnaraðili skal sæta einangrun ekki lengur en til miðvikudagsins 1. janúar 2020, kl. 12:00.',
      )
    })

    it('should format admission to facility case with isolation', () => {
      const defendant = {
        ...defendantBase,
      }
      const isCustodyIsolation = true
      const isolationToDate = '2020-01-01T12:31:00Z'
      const theCase = {
        type: CaseType.ADMISSION_TO_FACILITY,
      } as Case

      const result = fn(
        theCase,
        decision,
        defendant,
        validToDate,
        isCustodyIsolation,
        isolationToDate,
      )

      expect(result).toEqual(
        'Varnaraðili, Blær, skal sæta vistun á viðeigandi stofnun, þó ekki lengur en til miðvikudagsins 1. janúar 2020, kl. 12:31. Varnaraðili skal sæta einangrun á meðan á vistunni stendur.',
      )
    })

    it('should format travel ban case, defendant with national id', () => {
      const defendant = {
        ...defendantBase,
        noNationalId: false,
        nationalId: '0000000000',
      }
      const isCustodyIsolation = true
      const isolationToDate = '2020-01-01T12:31:00Z'
      const theCase = {
        type: CaseType.ADMISSION_TO_FACILITY,
      } as Case

      const result = fn(
        theCase,
        decision,
        defendant,
        validToDate,
        isCustodyIsolation,
        isolationToDate,
      )

      expect(result).toEqual(
        'Varnaraðili, Blær, kt. 000000-0000, skal sæta vistun á viðeigandi stofnun, þó ekki lengur en til miðvikudagsins 1. janúar 2020, kl. 12:31. Varnaraðili skal sæta einangrun á meðan á vistunni stendur.',
      )
    })
  })

  describe('accepting alternative travel ban', () => {
    const decision = CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
    const validToDate = '2020-01-01T12:31:00Z'

    it('should format as non extended travel ban case', () => {
      const defendant = { ...defendantBase }
      const theCase = {
        type: CaseType.CUSTODY,
        parentCase: { decision: CaseDecision.ACCEPTING } as Case,
      } as Case

      const result = fn(theCase, decision, defendant, validToDate)

      expect(result).toEqual(
        'Varnaraðili, Blær, skal sæta farbanni, þó ekki lengur en til miðvikudagsins 1. janúar 2020, kl. 12:31.',
      )
    })

    it('should format custody case as travel ban case', () => {
      const theCase = {
        type: CaseType.CUSTODY,
      } as Case

      const result = fn(theCase, decision, defendantBase, validToDate)

      expect(result).toEqual(
        'Varnaraðili, Blær, skal sæta farbanni, þó ekki lengur en til miðvikudagsins 1. janúar 2020, kl. 12:31.',
      )
    })
  })
})
