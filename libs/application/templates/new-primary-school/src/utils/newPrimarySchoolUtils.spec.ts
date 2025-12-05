import { NO, YES } from '@island.is/application/core'
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
  hasSpecialEducationSubType,
  needsOtherGuardianApproval,
  needsPayerApproval,
  shouldShowPage,
  shouldShowReasonForApplicationPage,
  showPreferredLanguageFields,
} from './conditionUtils'
import {
  ApplicationFeatureKey,
  ApplicationType,
  FIRST_GRADE_AGE,
  LanguageEnvironmentOptions,
  OptionsType,
  OrganizationSector,
  OrganizationSubType,
  OrganizationType,
  PayerOption,
  States,
} from './constants'
import {
  getApplicationType,
  getReasonOptionsType,
  getSpecialEducationDepartmentsInMunicipality,
} from './newPrimarySchoolUtils'

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
    const answers = {
      childNationalId: '1212121212',
    }
    const externalData = {
      children: {
        data: [
          {
            fullName: 'Stúfur Maack',
            nationalId: '1212121212',
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
    const answers = {
      childNationalId: '1212121212',
    }
    const externalData = {
      children: {
        data: [
          {
            fullName: 'Stúfur Maack ',
            nationalId: '1212121212',
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

  it('should return ENROLLMENT_IN_PRIMARY_SCHOOL for child in first grade, and child has not enrolled before (no data is found in Frigg)', () => {
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

  it('should return undefined for child in first grade, if child has enrolled before (data is found in Frigg)', () => {
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

    expect(getApplicationType(answers, externalData)).toBe(undefined)
  })

  it('should return undefined for child in 2. grade, and data is found in Frigg', () => {
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

    expect(getApplicationType(answers, externalData)).toBe(undefined)
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
    } as ExternalData

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
    } as ExternalData

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

describe('needsOtherGuardianApproval', () => {
  it('should return true if the application feature for the selected school includes ADDITIONAL_REQUESTORS key and otherParent exists in externalData', () => {
    const schoolId = uuid()
    const application = buildApplication({
      answers: {
        childNationalId: '1212121212',
        newSchool: {
          municipality: '3000',
          school: schoolId,
        },
      },
      externalData: {
        children: {
          data: [
            {
              fullName: 'Stúfur Maack',
              nationalId: '1212121212',
              otherParent: {
                nationalId: '1234567890',
                name: 'John Doe',
              },
            },
          ],
          date: new Date(),
          status: 'success',
        },
        schools: {
          data: [
            {
              id: schoolId,
              settings: {
                applicationConfigs: [
                  {
                    applicationFeatures: [
                      { key: ApplicationFeatureKey.ADDITIONAL_REQUESTORS },
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

    expect(needsOtherGuardianApproval(application)).toBe(true)
  })

  it('should return false if the application feature for the selected school does not include ADDITIONAL_REQUESTORS key or otherParent does not exist in externalData', () => {
    const schoolId = uuid()
    const application1 = buildApplication({
      answers: {
        childNationalId: '1212121212',
        newSchool: {
          municipality: '3000',
          school: schoolId,
        },
      },
      externalData: {
        children: {
          data: [
            {
              fullName: 'Stúfur Maack',
              nationalId: '1212121212',
              otherParent: {
                nationalId: '1234567890',
                name: 'John Doe',
              },
            },
          ],
          date: new Date(),
          status: 'success',
        },
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

    expect(needsOtherGuardianApproval(application1)).toBe(false)

    const application2 = buildApplication({
      answers: {
        childNationalId: '1212121212',
        newSchool: {
          municipality: '3000',
          school: schoolId,
        },
      },
      externalData: {
        children: {
          data: [
            {
              fullName: 'Stúfur Maack',
              nationalId: '1212121212',
            },
          ],
          date: new Date(),
          status: 'success',
        },
        schools: {
          data: [
            {
              id: schoolId,
              settings: {
                applicationConfigs: [
                  {
                    applicationFeatures: [
                      { key: ApplicationFeatureKey.ADDITIONAL_REQUESTORS },
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

    expect(needsOtherGuardianApproval(application2)).toBe(false)
  })
})

describe('hasSpecialEducationSubType', () => {
  let application: Application

  const specialEducationBehaviorDepartmentSchoolId = uuid()
  const specialEducationBehaviorSchoolSchoolId = uuid()
  const specialEducationDisabilityDepartmentSchoolId = uuid()
  const specialEducationDisabilitySchoolSchoolId = uuid()
  const internationalSchoolSchoolId = uuid()
  const generalSchoolSchoolId = uuid()

  beforeEach(() => {
    application = buildApplication({
      externalData: {
        schools: {
          data: [
            {
              id: specialEducationBehaviorDepartmentSchoolId,
              sector: OrganizationSector.PUBLIC,
              subType:
                OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
            },
            {
              id: specialEducationBehaviorSchoolSchoolId,
              sector: OrganizationSector.PUBLIC,
              subType: OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_SCHOOL,
            },
            {
              id: specialEducationDisabilityDepartmentSchoolId,
              sector: OrganizationSector.PUBLIC,
              subType:
                OrganizationSubType.SPECIAL_EDUCATION_DISABILITY_DEPARTMENT,
            },
            {
              id: specialEducationDisabilitySchoolSchoolId,
              sector: OrganizationSector.PUBLIC,
              subType: OrganizationSubType.SPECIAL_EDUCATION_DISABILITY_SCHOOL,
            },
            {
              id: internationalSchoolSchoolId,
              sector: OrganizationSector.PUBLIC,
              subType: OrganizationSubType.INTERNATIONAL_SCHOOL,
            },
            {
              id: generalSchoolSchoolId,
              sector: OrganizationSector.PUBLIC,
              subType: OrganizationSubType.GENERAL_SCHOOL,
            },
          ],
          date: new Date(),
          status: 'success',
        },
      },
    })
  })

  it('should return true if the selected school has subType SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT', () => {
    application.answers.newSchool = {
      municipality: '3000',
      school: specialEducationBehaviorDepartmentSchoolId,
    }

    expect(
      hasSpecialEducationSubType(application.answers, application.externalData),
    ).toBe(true)
  })

  it('should return true if the selected school has subType SPECIAL_EDUCATION_BEHAVIOR_SCHOOL', () => {
    application.answers.newSchool = {
      municipality: '3000',
      school: specialEducationBehaviorSchoolSchoolId,
    }

    expect(
      hasSpecialEducationSubType(application.answers, application.externalData),
    ).toBe(true)
  })

  it('should return true if the selected school has subType SPECIAL_EDUCATION_DISABILITY_DEPARTMENT', () => {
    application.answers.newSchool = {
      municipality: '3000',
      school: specialEducationDisabilityDepartmentSchoolId,
    }

    expect(
      hasSpecialEducationSubType(application.answers, application.externalData),
    ).toBe(true)
  })

  it('should return true if the selected school has subType SPECIAL_EDUCATION_DISABILITY_SCHOOL', () => {
    application.answers.newSchool = {
      municipality: '3000',
      school: specialEducationDisabilitySchoolSchoolId,
    }

    expect(
      hasSpecialEducationSubType(application.answers, application.externalData),
    ).toBe(true)
  })

  it('should return false if the selected school has subType INTERNATIONAL_SCHOOL', () => {
    application.answers.newSchool = {
      municipality: '3000',
      school: internationalSchoolSchoolId,
    }

    expect(
      hasSpecialEducationSubType(application.answers, application.externalData),
    ).toBe(false)
  })

  it('should return false if the selected school has subType GENERAL_SCHOOL', () => {
    application.answers.newSchool = {
      municipality: '3000',
      school: generalSchoolSchoolId,
    }

    expect(
      hasSpecialEducationSubType(application.answers, application.externalData),
    ).toBe(false)
  })
})

describe('shouldShowReasonForApplicationPage', () => {
  it('should return true if application type is NEW_PRIMARY_SCHOOL', () => {
    const answers = {
      applicationType: ApplicationType.NEW_PRIMARY_SCHOOL,
    }
    expect(shouldShowReasonForApplicationPage(answers)).toBe(true)
  })

  it('should return false if application type is ENROLLMENT_IN_PRIMARY_SCHOOL and applyForPreferredSchool is YES', () => {
    const answers = {
      applicationType: ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL,
      school: { applyForPreferredSchool: YES },
    }
    expect(shouldShowReasonForApplicationPage(answers)).toBe(false)
  })

  it('should return true if application type is ENROLLMENT_IN_PRIMARY_SCHOOL and applyForPreferredSchool is NO', () => {
    const answers = {
      applicationType: ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL,
      school: { applyForPreferredSchool: NO },
    }
    expect(shouldShowReasonForApplicationPage(answers)).toBe(true)
  })

  it('should return false if application type is CONTINUING_ENROLLMENT', () => {
    const answers = {
      applicationType: ApplicationType.CONTINUING_ENROLLMENT,
    }
    expect(shouldShowReasonForApplicationPage(answers)).toBe(false)
  })
})

describe('getSpecialEducationDepartmentsInMunicipality', () => {
  let application: Application

  beforeEach(() => {
    application = buildApplication({
      externalData: {
        schools: {
          data: [
            {
              name: 'Brúarskóli - Brúarhús við Húsaskóla',
              type: OrganizationType.School,
              sector: OrganizationSector.PUBLIC,
              unitId: 'G-1236-D',
              address: {
                address: 'Dalhúsum 41',
                postCode: '112',
                municipality: 'Reykjavíkurborg',
                municipalityId: '0000',
              },
              subType:
                OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
              gradeLevels: ['03', '04', '05', '06', '07'],
            },
            {
              name: 'Brúarskóli - Stuðlar',
              type: OrganizationType.School,
              sector: OrganizationSector.PUBLIC,
              unitId: 'G-1236-C',
              address: {
                address: 'Vesturhlíð 3',
                postCode: '105',
                municipality: 'Reykjavíkurborg',
                municipalityId: '0000',
              },
              subType:
                OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
              gradeLevels: ['08', '09', '10'],
            },
            {
              name: 'Brúarskóli - Vesturhlíð',
              type: OrganizationType.School,
              sector: OrganizationSector.PUBLIC,
              unitId: 'G-1236-A',
              address: {
                address: 'Vesturhlíð 3',
                postCode: '105',
                municipality: 'Reykjavíkurborg',
                municipalityId: '0000',
              },
              subType:
                OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
              gradeLevels: ['04', '05', '06', '07', '08', '09', '10'],
            },
            {
              name: 'Brúarskóli - Brúarsel við Ingunnarskóla',
              type: OrganizationType.School,
              sector: OrganizationSector.PUBLIC,
              unitId: 'G-1236-E',
              address: {
                address: 'Maríubaugi 1',
                postCode: '113',
                municipality: 'Reykjavíkurborg',
                municipalityId: '0000',
              },
              subType:
                OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
              gradeLevels: ['03', '04', '05', '06', '07'],
            },
            {
              name: 'Álfhólsskóli - Hjalli',
              type: OrganizationType.School,
              sector: OrganizationSector.PUBLIC,
              unitId: 'G-2384-B',
              address: {
                address: 'Álfhólsvegi 120',
                postCode: '200',
                municipality: 'Kópavogsbær',
                municipalityId: '1000',
              },
              subType:
                OrganizationSubType.SPECIAL_EDUCATION_DISABILITY_DEPARTMENT,
              gradeLevels: ['05', '06', '07', '08', '09', '10'],
            },
          ],
          date: new Date(),
          status: 'success',
        },
      },
    })
  })

  it('Should return all special education departments in the selected municipality', () => {
    application.answers.newSchool = {
      municipality: '0000',
      school: uuid(),
    }

    const res = getSpecialEducationDepartmentsInMunicipality(
      application.answers,
      application.externalData,
    )

    expect(res).toEqual([
      {
        name: 'Brúarskóli - Brúarhús við Húsaskóla',
        type: OrganizationType.School,
        sector: OrganizationSector.PUBLIC,
        unitId: 'G-1236-D',
        address: {
          address: 'Dalhúsum 41',
          postCode: '112',
          municipality: 'Reykjavíkurborg',
          municipalityId: '0000',
        },
        subType: OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
        gradeLevels: ['03', '04', '05', '06', '07'],
      },
      {
        name: 'Brúarskóli - Stuðlar',
        type: OrganizationType.School,
        sector: OrganizationSector.PUBLIC,
        unitId: 'G-1236-C',
        address: {
          address: 'Vesturhlíð 3',
          postCode: '105',
          municipality: 'Reykjavíkurborg',
          municipalityId: '0000',
        },
        subType: OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
        gradeLevels: ['08', '09', '10'],
      },
      {
        name: 'Brúarskóli - Vesturhlíð',
        type: OrganizationType.School,
        sector: OrganizationSector.PUBLIC,
        unitId: 'G-1236-A',
        address: {
          address: 'Vesturhlíð 3',
          postCode: '105',
          municipality: 'Reykjavíkurborg',
          municipalityId: '0000',
        },
        subType: OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
        gradeLevels: ['04', '05', '06', '07', '08', '09', '10'],
      },
      {
        name: 'Brúarskóli - Brúarsel við Ingunnarskóla',
        type: OrganizationType.School,
        sector: OrganizationSector.PUBLIC,
        unitId: 'G-1236-E',
        address: {
          address: 'Maríubaugi 1',
          postCode: '113',
          municipality: 'Reykjavíkurborg',
          municipalityId: '0000',
        },
        subType: OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
        gradeLevels: ['03', '04', '05', '06', '07'],
      },
    ])
  })
  it('Should return an empty array if no special education department in the selected municipality', () => {
    application.answers.newSchool = {
      municipality: '3000',
      school: uuid(),
    }

    const res = getSpecialEducationDepartmentsInMunicipality(
      application.answers,
      application.externalData,
    )

    expect(res).toEqual([])
  })

  it('Should return all special education departments in the selected municipality if no childGradeLevel', () => {
    application.answers.newSchool = {
      municipality: '0000',
      school: uuid(),
    }

    const res = getSpecialEducationDepartmentsInMunicipality(
      application.answers,
      application.externalData,
    )

    expect(res).toEqual([
      {
        name: 'Brúarskóli - Brúarhús við Húsaskóla',
        type: OrganizationType.School,
        sector: OrganizationSector.PUBLIC,
        unitId: 'G-1236-D',
        address: {
          address: 'Dalhúsum 41',
          postCode: '112',
          municipality: 'Reykjavíkurborg',
          municipalityId: '0000',
        },
        subType: OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
        gradeLevels: ['03', '04', '05', '06', '07'],
      },
      {
        name: 'Brúarskóli - Stuðlar',
        type: OrganizationType.School,
        sector: OrganizationSector.PUBLIC,
        unitId: 'G-1236-C',
        address: {
          address: 'Vesturhlíð 3',
          postCode: '105',
          municipality: 'Reykjavíkurborg',
          municipalityId: '0000',
        },
        subType: OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
        gradeLevels: ['08', '09', '10'],
      },
      {
        name: 'Brúarskóli - Vesturhlíð',
        type: OrganizationType.School,
        sector: OrganizationSector.PUBLIC,
        unitId: 'G-1236-A',
        address: {
          address: 'Vesturhlíð 3',
          postCode: '105',
          municipality: 'Reykjavíkurborg',
          municipalityId: '0000',
        },
        subType: OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
        gradeLevels: ['04', '05', '06', '07', '08', '09', '10'],
      },
      {
        name: 'Brúarskóli - Brúarsel við Ingunnarskóla',
        type: OrganizationType.School,
        sector: OrganizationSector.PUBLIC,
        unitId: 'G-1236-E',
        address: {
          address: 'Maríubaugi 1',
          postCode: '113',
          municipality: 'Reykjavíkurborg',
          municipalityId: '0000',
        },
        subType: OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
        gradeLevels: ['03', '04', '05', '06', '07'],
      },
    ])
  })

  it('Should return all special education departments in the selected municipality that offer the childs current and next grade', () => {
    application.answers.newSchool = {
      municipality: '0000',
      school: uuid(),
    }
    application.externalData.childInformation = {
      data: {
        gradeLevel: '03',
      },
      date: new Date(),
      status: 'success',
    }

    const res = getSpecialEducationDepartmentsInMunicipality(
      application.answers,
      application.externalData,
    )

    expect(res).toEqual([
      {
        name: 'Brúarskóli - Brúarhús við Húsaskóla',
        type: OrganizationType.School,
        sector: OrganizationSector.PUBLIC,
        unitId: 'G-1236-D',
        address: {
          address: 'Dalhúsum 41',
          postCode: '112',
          municipality: 'Reykjavíkurborg',
          municipalityId: '0000',
        },
        subType: OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
        gradeLevels: ['03', '04', '05', '06', '07'],
      },
      {
        name: 'Brúarskóli - Vesturhlíð',
        type: OrganizationType.School,
        sector: OrganizationSector.PUBLIC,
        unitId: 'G-1236-A',
        address: {
          address: 'Vesturhlíð 3',
          postCode: '105',
          municipality: 'Reykjavíkurborg',
          municipalityId: '0000',
        },
        subType: OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
        gradeLevels: ['04', '05', '06', '07', '08', '09', '10'],
      },
      {
        name: 'Brúarskóli - Brúarsel við Ingunnarskóla',
        type: OrganizationType.School,
        sector: OrganizationSector.PUBLIC,
        unitId: 'G-1236-E',
        address: {
          address: 'Maríubaugi 1',
          postCode: '113',
          municipality: 'Reykjavíkurborg',
          municipalityId: '0000',
        },
        subType: OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
        gradeLevels: ['03', '04', '05', '06', '07'],
      },
    ])
  })

  it('Should return an empty array if no special education department offers the childs current and next grade', () => {
    application.answers.newSchool = {
      municipality: '0000',
      school: uuid(),
    }
    application.externalData.childInformation = {
      data: {
        gradeLevel: '01',
      },
      date: new Date(),
      status: 'success',
    }

    const res = getSpecialEducationDepartmentsInMunicipality(
      application.answers,
      application.externalData,
    )

    expect(res).toEqual([])
  })
})

describe('getReasonOptionsType', () => {
  let application: Application

  const publicInternationalSchoolSchoolId = uuid()
  const privateInternationalSchoolSchoolId = uuid()
  const publicGeneralSchoolSchoolId = uuid()
  const privateGeneralSchoolSchoolId = uuid()

  beforeEach(() => {
    application = buildApplication({
      externalData: {
        schools: {
          data: [
            {
              id: publicInternationalSchoolSchoolId,
              sector: OrganizationSector.PUBLIC,
              subType: OrganizationSubType.INTERNATIONAL_SCHOOL,
            },
            {
              id: privateInternationalSchoolSchoolId,
              sector: OrganizationSector.PRIVATE,
              subType: OrganizationSubType.INTERNATIONAL_SCHOOL,
            },
            {
              id: publicGeneralSchoolSchoolId,
              sector: OrganizationSector.PUBLIC,
              subType: OrganizationSubType.GENERAL_SCHOOL,
            },
            {
              id: privateGeneralSchoolSchoolId,
              sector: OrganizationSector.PRIVATE,
              subType: OrganizationSubType.GENERAL_SCHOOL,
            },
          ],
          date: new Date(),
          status: 'success',
        },
      },
    })
  })

  it('should return REASON_INTERNATIONAL_SCHOOL if the selected school has subType INTERNATIONAL_SCHOOL and sector PUBLIC', () => {
    application.answers.newSchool = {
      municipality: '3000',
      school: publicInternationalSchoolSchoolId,
    }

    expect(
      getReasonOptionsType(application.answers, application.externalData),
    ).toBe(OptionsType.REASON_INTERNATIONAL_SCHOOL)
  })

  it('should return REASON_INTERNATIONAL_SCHOOL if the selected school has subType INTERNATIONAL_SCHOOL and sector PRIVATE', () => {
    application.answers.newSchool = {
      municipality: '3000',
      school: privateInternationalSchoolSchoolId,
    }

    expect(
      getReasonOptionsType(application.answers, application.externalData),
    ).toBe(OptionsType.REASON_INTERNATIONAL_SCHOOL)
  })

  it('should return REASON if the selected school has subType GENERAL_SCHOOL and sector PUBLIC', () => {
    application.answers.newSchool = {
      municipality: '3000',
      school: publicGeneralSchoolSchoolId,
    }

    expect(
      getReasonOptionsType(application.answers, application.externalData),
    ).toBe(OptionsType.REASON)
  })

  it('should return REASON_PRIVATE_SCHOOL if the selected school has subType GENERAL_SCHOOL and sector PRIVATE', () => {
    application.answers.newSchool = {
      municipality: '3000',
      school: privateGeneralSchoolSchoolId,
    }

    expect(
      getReasonOptionsType(application.answers, application.externalData),
    ).toBe(OptionsType.REASON_PRIVATE_SCHOOL)
  })
})
