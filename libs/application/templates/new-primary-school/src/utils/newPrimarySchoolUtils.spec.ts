import { ExternalData } from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { uuid } from 'uuidv4'
import { hasOtherGuardian, showPreferredLanguageFields } from './conditionUtils'
import {
  ApplicationType,
  FIRST_GRADE_AGE,
  LanguageEnvironmentOptions,
} from './constants'
import { getApplicationType } from './newPrimarySchoolUtils'

describe('hasOtherGuardian', () => {
  it('should return true if otherParent exists in externalData', () => {
    const answers = {}
    const externalData = {
      children: {
        data: [
          {
            fullName: 'Stúfur Maack ',
            otherParent: {
              nationalId: '1234567890',
              name: 'John Doe',
            },
          },
        ],
      },
    } as unknown as ExternalData

    expect(hasOtherGuardian(answers, externalData)).toBe(true)
  })

  it('should return false if otherParent does not exist in externalData', () => {
    const answers = {}
    const externalData = {
      children: {
        data: [
          {
            fullName: 'Stúfur Maack ',
          },
        ],
      },
    } as unknown as ExternalData
    expect(hasOtherGuardian(answers, externalData)).toBe(false)
  })
})
describe('showPreferredLanguageFields', () => {
  it('should return false when selectedLanguages is empty', () => {
    const answers = {
      languages: {
        selectedLanguages: [],
      },
    }
    expect(showPreferredLanguageFields(answers)).toBe(false)
  })

  it('should return false when languageEnvironment only icelandic', () => {
    const answers = {
      languages: {
        languageEnvironment: `${uuid()}::${
          LanguageEnvironmentOptions.ONLY_ICELANDIC
        }`,
      },
    }
    expect(showPreferredLanguageFields(answers)).toBe(false)
  })

  it('should return false when languageEnvironment is ONLY_OTHER_THAN_ICELANDIC and non language is selected', () => {
    const answers = {
      languages: {
        languageEnvironment: `${uuid()}::${
          LanguageEnvironmentOptions.ONLY_OTHER_THAN_ICELANDIC
        }`,
        selectedLanguages: [],
      },
    }
    expect(showPreferredLanguageFields(answers)).toBe(false)
  })

  it('should return true when languageEnvironment is ONLY_OTHER_THAN_ICELANDIC and one language is selected', () => {
    const answers = {
      languages: {
        languageEnvironment: `${uuid()}::${
          LanguageEnvironmentOptions.ONLY_OTHER_THAN_ICELANDIC
        }`,
        selectedLanguages: [{ code: 'en' }],
      },
    }
    expect(showPreferredLanguageFields(answers)).toBe(true)
  })

  it('should return false when languageEnvironment is ICELANDIC_AND_OTHER and non language is selected', () => {
    const answers = {
      languages: {
        languageEnvironment: `${uuid()}::${
          LanguageEnvironmentOptions.ICELANDIC_AND_OTHER
        }`,
        selectedLanguages: [],
      },
    }
    expect(showPreferredLanguageFields(answers)).toBe(false)
  })

  it('should return false when languageEnvironment is ICELANDIC_AND_OTHER and one language is selected', () => {
    const answers = {
      languages: {
        languageEnvironment: `${uuid()}::${
          LanguageEnvironmentOptions.ICELANDIC_AND_OTHER
        }`,
        selectedLanguages: [{ code: 'en' }],
      },
    }
    expect(showPreferredLanguageFields(answers)).toBe(false)
  })

  it('should return true when languageEnvironment is ICELANDIC_AND_OTHER and two language is selected', () => {
    const answers = {
      languages: {
        languageEnvironment: `${uuid()}::${
          LanguageEnvironmentOptions.ICELANDIC_AND_OTHER
        }`,
        selectedLanguages: [{ code: 'en' }, { code: 'is' }],
      },
    }
    expect(showPreferredLanguageFields(answers)).toBe(true)
  })
})

describe('getApplicationType', () => {
  const currentDate = new Date()

  it('should return NEW_PRIMARY_SCHOOL for child in 2. grade', () => {
    const yearBorn = currentDate.getFullYear() - FIRST_GRADE_AGE - 1 //2. grade

    const answers = {
      childNationalId: kennitala.generatePerson(new Date(yearBorn, 11, 31)),
    }
    const externalData = {
      childInformation: {
        data: {
          primaryOrgId: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
        },
      },
    } as unknown as ExternalData

    expect(getApplicationType(answers, externalData)).toBe(
      ApplicationType.NEW_PRIMARY_SCHOOL,
    )
  })

  it('should return NEW_PRIMARY_SCHOOL for child in 2. grade, if no data is found in Frigg', () => {
    const yearBorn = currentDate.getFullYear() - FIRST_GRADE_AGE - 1 //2. grade

    const answers = {
      childNationalId: kennitala.generatePerson(new Date(yearBorn, 11, 31)),
    }
    const externalData = {
      childInformation: {
        data: {},
      },
    } as unknown as ExternalData

    expect(getApplicationType(answers, externalData)).toBe(
      ApplicationType.NEW_PRIMARY_SCHOOL,
    )
  })

  it('should return ENROLLMENT_IN_PRIMARY_SCHOOL for child in first grade', () => {
    const yearBorn = currentDate.getFullYear() - FIRST_GRADE_AGE

    const answers = {
      childNationalId: kennitala.generatePerson(new Date(yearBorn, 0, 1)),
    }

    const externalData = {
      childInformation: {
        data: {},
      },
    } as unknown as ExternalData

    expect(getApplicationType(answers, externalData)).toBe(
      ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL,
    )
  })

  it('should return NEW_PRIMARY_SCHOOL for child in first grade, if child has enrolled before (data is found in Frigg)', () => {
    const yearBorn = currentDate.getFullYear() - FIRST_GRADE_AGE

    const answers = {
      childNationalId: kennitala.generatePerson(new Date(yearBorn, 0, 1)),
    }
    const externalData = {
      childInformation: {
        data: {
          primaryOrgId: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
        },
      },
    } as unknown as ExternalData

    expect(getApplicationType(answers, externalData)).toBe(
      ApplicationType.NEW_PRIMARY_SCHOOL,
    )
  })
})
