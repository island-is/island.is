import { ExternalData } from '@island.is/application/types'
import {
  hasOtherGuardian,
  showPreferredLanguageFields,
} from './newPrimarySchoolUtils'
import { LanguageEnvironmentOptions } from './constants'

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
        languageEnvironment: LanguageEnvironmentOptions.ONLY_ICELANDIC,
      },
    }
    expect(showPreferredLanguageFields(answers)).toBe(false)
  })

  it('should return false when languageEnvironment is ONLY_OTHER_THAN_ICELANDIC and non language is selected', () => {
    const answers = {
      languages: {
        languageEnvironment:
          LanguageEnvironmentOptions.ONLY_OTHER_THAN_ICELANDIC,
        selectedLanguages: [],
      },
    }
    expect(showPreferredLanguageFields(answers)).toBe(false)
  })

  it('should return true when languageEnvironment is ONLY_OTHER_THAN_ICELANDIC and one language is selected', () => {
    const answers = {
      languages: {
        languageEnvironment:
          LanguageEnvironmentOptions.ONLY_OTHER_THAN_ICELANDIC,
        selectedLanguages: [{ code: 'en' }],
      },
    }
    expect(showPreferredLanguageFields(answers)).toBe(true)
  })

  it('should return false when languageEnvironment is ICELANDIC_AND_OTHER and non language is selected', () => {
    const answers = {
      languages: {
        languageEnvironment: LanguageEnvironmentOptions.ICELANDIC_AND_OTHER,
        selectedLanguages: [],
      },
    }
    expect(showPreferredLanguageFields(answers)).toBe(false)
  })

  it('should return false when languageEnvironment is ICELANDIC_AND_OTHER and one language is selected', () => {
    const answers = {
      languages: {
        languageEnvironment: LanguageEnvironmentOptions.ICELANDIC_AND_OTHER,
        selectedLanguages: [{ code: 'en' }],
      },
    }
    expect(showPreferredLanguageFields(answers)).toBe(false)
  })

  it('should return true when languageEnvironment is ICELANDIC_AND_OTHER and two language is selected', () => {
    const answers = {
      languages: {
        languageEnvironment: LanguageEnvironmentOptions.ICELANDIC_AND_OTHER,
        selectedLanguages: [{ code: 'en' }, { code: 'is' }],
      },
    }
    expect(showPreferredLanguageFields(answers)).toBe(true)
  })
})
