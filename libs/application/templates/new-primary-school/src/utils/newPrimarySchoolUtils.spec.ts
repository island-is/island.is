import { ExternalData } from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { uuid } from 'uuidv4'
import {
  hasOtherGuardian,
  hasOtherPayer,
  hasPayer,
  needsPayerApproval,
  showPreferredLanguageFields,
} from './conditionUtils'
import {
  ApplicationType,
  FIRST_GRADE_AGE,
  LanguageEnvironmentOptions,
  PayerOption,
  SchoolType,
} from './constants'
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

  // ADD BACK WHEN ENROLLMENT_IN_PRIMARY_SCHOOL GOES LIVE
  // it('should return ENROLLMENT_IN_PRIMARY_SCHOOL for child in first grade', () => {
  //   const yearBorn = currentDate.getFullYear() - FIRST_GRADE_AGE

  //   const answers = {
  //     childNationalId: kennitala.generatePerson(new Date(yearBorn, 0, 1)),
  //   }

  //   const externalData = {
  //     childInformation: {
  //       data: {},
  //     },
  //   } as unknown as ExternalData

  //   expect(getApplicationType(answers, externalData)).toBe(
  //     ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL,
  //   )
  // })

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

describe('hasPayer', () => {
  it('should return true if the selected school is a private school', () => {
    const answers = {
      newSchool: {
        municipality: '3000',
        school: `${uuid()}::${SchoolType.PRIVATE_SCHOOL}`,
        type: SchoolType.PRIVATE_SCHOOL,
      },
    }

    expect(hasPayer(answers)).toBe(true)
  })

  it('should return false if the selected school is not a private school', () => {
    const answers = {
      newSchool: {
        municipality: '3000',
        school: `${uuid()}::${SchoolType.PUBLIC_SCHOOL}`,
        type: SchoolType.PUBLIC_SCHOOL,
      },
    }

    expect(hasPayer(answers)).toBe(false)
  })
})

describe('hasOtherPayer', () => {
  it('should return true when payer is OTHER', () => {
    const answers = {
      newSchool: {
        municipality: '3000',
        school: `${uuid()}::${SchoolType.PRIVATE_SCHOOL}`,
        type: SchoolType.PRIVATE_SCHOOL,
      },
      payer: {
        option: PayerOption.OTHER,
      },
    }

    expect(hasOtherPayer(answers)).toBe(true)
  })

  it('should return false when payer is APPLICANT', () => {
    const answers = {
      newSchool: {
        municipality: '3000',
        school: `${uuid()}::${SchoolType.PRIVATE_SCHOOL}`,
        type: SchoolType.PRIVATE_SCHOOL,
      },
      payer: {
        option: PayerOption.APPLICANT,
      },
    }

    expect(hasOtherPayer(answers)).toBe(false)
  })
})

describe('needsPayerApproval', () => {
  it('should return true if the selected school is a private school and payer is OTHER', () => {
    const answers = {
      newSchool: {
        municipality: '3000',
        school: `${uuid()}::${SchoolType.PRIVATE_SCHOOL}`,
        type: SchoolType.PRIVATE_SCHOOL,
      },
      payer: {
        option: PayerOption.OTHER,
        other: {
          name: 'John Doe',
          nationalId: '1234567890',
        },
      },
    }

    expect(needsPayerApproval(answers)).toBe(true)
  })

  it('should return false if the selected school is not a private school or payer is APPLICANT', () => {
    const answers1 = {
      newSchool: {
        municipality: '3000',
        school: `${uuid()}::${SchoolType.PUBLIC_SCHOOL}`,
        type: SchoolType.PUBLIC_SCHOOL,
      },
      payer: {
        option: PayerOption.OTHER,
        other: {
          name: 'John Doe',
          nationalId: '1234567890',
        },
      },
    }

    expect(needsPayerApproval(answers1)).toBe(false)

    const answers2 = {
      newSchool: {
        municipality: '3000',
        school: `${uuid()}::${SchoolType.PRIVATE_SCHOOL}`,
        type: SchoolType.PRIVATE_SCHOOL,
      },
      payer: {
        option: PayerOption.APPLICANT,
      },
    }

    expect(needsPayerApproval(answers2)).toBe(false)
  })
})
