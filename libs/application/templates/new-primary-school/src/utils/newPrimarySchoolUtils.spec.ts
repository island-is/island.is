import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { uuid } from 'uuidv4'
import {
  hasOtherGuardian,
  hasOtherPayer,
  needsPayerApproval,
  shouldShowPage,
  showPreferredLanguageFields,
} from './conditionUtils'
import {
  ApplicationFeatureKey,
  ApplicationType,
  FIRST_GRADE_AGE,
  LanguageEnvironmentOptions,
  PayerOption,
  States,
} from './constants'
import { getApplicationType } from './newPrimarySchoolUtils'

const buildApplication = (data: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application => {
  const { answers = {}, externalData = {}, state = States.DRAFT } = data
  return {
    id: '12345',
    assignees: [],
    applicant: '123456-7890',
    typeId: ApplicationTypes.NEW_PRIMARY_SCHOOL,
    created: new Date(),
    status: ApplicationStatus.IN_PROGRESS,
    modified: new Date(),
    applicantActors: [],
    answers,
    state,
    externalData,
  }
}

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

describe('shouldShowPage', () => {
  it('should return true if the application feature for the selected school includes key', () => {
    const schoolId = uuid()
    const answers = {
      newSchool: {
        municipality: '3000',
        school: schoolId,
      },
    }
    const externalData = {
      schools: {
        data: [
          {
            id: schoolId,
            settings: {
              applicationConfigs: [
                {
                  applicationFeatures: [
                    { key: ApplicationFeatureKey.PAYMENT_INFO },
                  ],
                },
              ],
            },
          },
        ],
        date: new Date(),
        status: 'success',
      },
    }

    expect(
      shouldShowPage(answers, externalData, ApplicationFeatureKey.PAYMENT_INFO),
    ).toBe(true)
  })

  it('should return false if the application feature for the selected school does not include key', () => {
    const schoolId = uuid()
    const answers = {
      newSchool: {
        municipality: '3000',
        school: schoolId,
      },
    }
    const externalData = {
      schools: {
        data: [
          {
            id: schoolId,
            settings: {
              applicationConfigs: [
                {
                  applicationFeatures: [
                    { key: ApplicationFeatureKey.APPLICANT_INFO },
                  ],
                },
              ],
            },
          },
        ],
        date: new Date(),
        status: 'success',
      },
    }

    expect(
      shouldShowPage(answers, externalData, ApplicationFeatureKey.PAYMENT_INFO),
    ).toBe(false)
  })
})

describe('hasOtherPayer', () => {
  it('should return true when payer is OTHER', () => {
    const answers = {
      newSchool: {
        municipality: '3000',
        school: uuid(),
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
        school: uuid(),
      },
      payer: {
        option: PayerOption.APPLICANT,
      },
    }

    expect(hasOtherPayer(answers)).toBe(false)
  })
})

describe('needsPayerApproval', () => {
  it('should return true if the application feature for the selected school includes PAYMENT_INFO key and payer is OTHER', () => {
    const schoolId = uuid()
    const application = buildApplication({
      answers: {
        newSchool: {
          municipality: '3000',
          school: schoolId,
        },
        payer: {
          option: PayerOption.OTHER,
          other: {
            name: 'John Doe',
            nationalId: '1234567890',
          },
        },
      },
      externalData: {
        schools: {
          data: [
            {
              id: schoolId,
              settings: {
                applicationConfigs: [
                  {
                    applicationFeatures: [
                      { key: ApplicationFeatureKey.PAYMENT_INFO },
                    ],
                  },
                ],
              },
            },
          ],
          date: new Date(),
          status: 'success',
        },
      },
    })

    expect(needsPayerApproval(application)).toBe(true)
  })

  it('should return false if the application feature for the selected school does not include PAYMENT_INFO key or payer is APPLICANT', () => {
    const schoolId = uuid()
    const application1 = buildApplication({
      answers: {
        newSchool: {
          municipality: '3000',
          school: schoolId,
        },
        payer: {
          option: PayerOption.OTHER,
          other: {
            name: 'John Doe',
            nationalId: '1234567890',
          },
        },
      },
      externalData: {
        schools: {
          data: [
            {
              id: schoolId,
              settings: {
                applicationConfigs: [
                  {
                    applicationFeatures: [
                      { key: ApplicationFeatureKey.APPLICANT_INFO },
                    ],
                  },
                ],
              },
            },
          ],
          date: new Date(),
          status: 'success',
        },
      },
    })

    expect(needsPayerApproval(application1)).toBe(false)

    const application2 = buildApplication({
      answers: {
        newSchool: {
          municipality: '3000',
          school: schoolId,
        },
        payer: {
          option: PayerOption.APPLICANT,
        },
      },
      externalData: {
        schools: {
          data: [
            {
              id: schoolId,
              settings: {
                applicationConfigs: [
                  {
                    applicationFeatures: [
                      { key: ApplicationFeatureKey.PAYMENT_INFO },
                    ],
                  },
                ],
              },
            },
          ],
          date: new Date(),
          status: 'success',
        },
      },
    })

    expect(needsPayerApproval(application2)).toBe(false)
  })
})
