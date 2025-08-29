import { ExternalData } from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { uuid } from 'uuidv4'
import { hasOtherGuardian, showPreferredLanguageFields } from './conditionUtils'
import { ApplicationType, LanguageEnvironmentOptions } from './constants'
import {
  getApplicationType,
  getMunicipalityCodeBySchoolUnitId,
} from './newPrimarySchoolUtils'

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
describe('getMunicipalityCodeBySchoolUnitId', () => {
  it('should return the correct municipality code for a given school unitId', () => {
    const schoolId = 'G-2297-A'
    expect(getMunicipalityCodeBySchoolUnitId(schoolId)).toBe('1000')
  })

  it('should return undefined for an unknown school unit id', () => {
    const schoolId = 'unknown-school-id'
    expect(getMunicipalityCodeBySchoolUnitId(schoolId)).toBeUndefined()
  })
})

describe('getApplicationType', () => {
  const mockCurrentDate = new Date('2025-01-01')

  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockCurrentDate)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return NEW_PRIMARY_SCHOOL for child born before 2019', () => {
    const externalData = {
      childInformation: {
        data: {
          nationalId: kennitala.generatePerson(new Date('2018-12-31')),
        },
      },
    } as unknown as ExternalData

    expect(getApplicationType(externalData)).toBe(
      ApplicationType.NEW_PRIMARY_SCHOOL,
    )
  })

  it('should return ENROLLMENT_IN_PRIMARY_SCHOOL for child born in or after 2019', () => {
    const externalData = {
      childInformation: {
        data: {
          nationalId: kennitala.generatePerson(new Date('2019-01-01')),
        },
      },
    } as unknown as ExternalData

    expect(getApplicationType(externalData)).toBe(
      ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL,
    )
  })
})
