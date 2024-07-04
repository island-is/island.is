import { LawAndOrderDefenseChoiceEnum } from '@island.is/api/schema'

export enum Components {
  OVERVIEW = 'overview',
  COURT_CASES = 'courtCases',
  COURT_CASE_DETAIL = 'courtCaseDetail',
  SUBPOENA = 'subpoena',
}

interface Choice {
  code: LawAndOrderDefenseChoiceEnum
  message: {
    id: string
    defaultMessage: string
  }
}

export const DefenseChoices: Record<string, Choice> = {
  WAIVE: {
    code: LawAndOrderDefenseChoiceEnum.WAIVE,
    message: {
      id: 'sp.law-and-order:no-defender',
      defaultMessage: 'Ég óska ekki eftir verjanda',
    },
  },
  CHOOSE: {
    code: LawAndOrderDefenseChoiceEnum.CHOOSE,
    message: {
      id: 'sp.law-and-order:choosing-lawyer',
      defaultMessage:
        'Ég óska þess að valinn lögmaður verði skipaður verjandi minn',
    },
  },
  DELAY: {
    code: LawAndOrderDefenseChoiceEnum.DELAY,
    message: {
      id: 'sp.law-and-order:delay-choice',
      defaultMessage:
        'Ég óska eftir fresti fram að þingfestingu til þess að tilnefna verjanda',
    },
  },
  DELEGATE: {
    code: LawAndOrderDefenseChoiceEnum.DELEGATE,
    message: {
      id: 'sp.law-and-order:choose-for-me',
      defaultMessage: 'Ég fel dómara málsins að tilnefna og skipa mér verjanda',
    },
  },
}

// Example function to get a localized message for a choice
