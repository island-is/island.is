import {
  Application,
  ExternalData,
  RepeaterOptionValue,
} from '@island.is/application/types'
import {
  getAllSchoolsByMunicipality,
  hasOtherGuardian,
  setOnChangeSchool,
  showPreferredLanguageFields,
} from './newPrimarySchoolUtils'
import { LanguageEnvironmentOptions } from './constants'
import {
  FriggSchoolsByMunicipalityQuery,
  OrganizationModelTypeEnum,
} from '../types/schema'

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

describe('setOnChangeSchool', () => {
  it('should return the correct key-value pair when optionValue is provided', () => {
    const optionValue: RepeaterOptionValue = '123::PrivateOwner'
    expect(setOnChangeSchool(optionValue)).toEqual([
      { key: 'newSchool.type', value: 'PrivateOwner' },
    ])
  })

  it('should return an empty value when optionValue is undefined', () => {
    const optionValue: RepeaterOptionValue = undefined
    expect(setOnChangeSchool(optionValue)).toEqual([
      { key: 'newSchool.type', value: undefined },
    ])
  })
})

describe('getAllSchoolsByMunicipality', () => {
  it('should return all schools by municipality', async () => {
    const application = {
      externalData: {
        childInformation: {
          data: {
            gradeLevel: '1',
          },
        },
      },
    } as unknown as Application

    const municipality = 'Reykjavik'
    const data: FriggSchoolsByMunicipalityQuery = {
      friggSchoolsByMunicipality: [
        {
          id: 'municipality-1',
          nationalId: 'municipality-1',
          name: 'Reykjavik',
          type: OrganizationModelTypeEnum.Municipality,
          children: [
            {
              id: '1',
              unitId: 'unit-1',
              nationalId: '1234567890',
              name: 'School A',
              type: OrganizationModelTypeEnum.School,
              gradeLevels: ['1', '2'],
              address: {
                municipality: 'Reykjavik',
              },
            },
          ],
        },
        {
          id: 'private-2',
          nationalId: 'municipality-2',
          name: 'Reykjavik',
          type: OrganizationModelTypeEnum.PrivateOwner,
          children: [
            {
              id: '2',
              unitId: 'unit-2',
              nationalId: '0987654321',
              name: 'School B',
              type: OrganizationModelTypeEnum.School,
              gradeLevels: ['1', '2'],
              address: {
                municipality: 'Reykjavik',
              },
            },
          ],
        },
        {
          id: 'private-3',
          nationalId: 'municipality-3',
          name: 'Akureyrarbær',
          type: OrganizationModelTypeEnum.PrivateOwner,
          children: [
            {
              id: '3',
              unitId: 'unit-3',
              nationalId: '0987654321',
              name: 'School c',
              type: OrganizationModelTypeEnum.School,
              gradeLevels: ['1', '2'],
              address: {
                municipality: 'Akureyrarbær',
              },
            },
          ],
        },
      ],
    }

    const result = await getAllSchoolsByMunicipality(
      application,
      municipality,
      data,
    )
    expect(result).toEqual([
      { value: '1::School', label: 'School A' },
      { value: '2::PrivateOwner', label: 'School B' },
    ])
  })

  it('should return an empty array if no schools match the criteria', async () => {
    const application = {
      externalData: {
        childInformation: {
          data: {
            gradeLevel: '3',
          },
        },
      },
    } as unknown as Application

    const municipality = 'Reykjavik'
    const data: FriggSchoolsByMunicipalityQuery = {
      friggSchoolsByMunicipality: [
        {
          id: 'unit-1',
          nationalId: 'unit-1',
          name: 'Reykjavik',
          type: OrganizationModelTypeEnum.Municipality,
          children: [
            {
              id: '1',
              nationalId: 'unit-1',
              name: 'School A',
              type: OrganizationModelTypeEnum.School,
              gradeLevels: ['1', '2'],
              address: {
                municipality: 'Reykjavik',
              },
            },
          ],
        },
      ],
    }

    const result = await getAllSchoolsByMunicipality(
      application,
      municipality,
      data,
    )
    expect(result).toEqual([])
  })
})
