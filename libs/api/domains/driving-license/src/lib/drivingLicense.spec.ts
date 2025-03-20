import { Test } from '@nestjs/testing'
import { DrivingLicenseService } from './drivingLicense.service'
import {
  DrivingLicenseApiConfig,
  DrivingLicenseApiModule,
} from '@island.is/clients/driving-license'
import {
  DISQUALIFIED_NATIONAL_IDS,
  DISQUALIFIED_TOKENS,
  MOCK_NATIONAL_ID,
  MOCK_NATIONAL_ID_EXPIRED,
  MOCK_NATIONAL_ID_NO_ASSESSMENT,
  MOCK_NATIONAL_ID_TEACHER,
  MOCK_TOKEN,
  MOCK_TOKEN_EXPIRED,
  MOCK_TOKEN_NO_ASSESSMENT,
  MOCK_TOKEN_TEACHER,
  MOCK_USER,
  requestHandlers,
} from './__mock-data__/requestHandlers'
import { startMocking } from '@island.is/shared/mocking'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { NationalRegistryXRoadService } from '@island.is/api/domains/national-registry-x-road'
import ResidenceHistory from '../lib/__mock-data__/residenceHistory.json'
import { ConfigModule } from '@island.is/nest/config'

import { DrivingLicenseCategory } from './drivingLicense.type'

const daysOfResidency = 365

startMocking(requestHandlers)
describe('DrivingLicenseService', () => {
  let service: DrivingLicenseService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        DrivingLicenseApiModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [DrivingLicenseApiConfig],
        }),
      ],
      providers: [
        DrivingLicenseService,
        { provide: 'CONFIG', useValue: {} },
        {
          provide: LOGGER_PROVIDER,
          useValue: {
            warn: () => undefined,
          },
        },
        {
          provide: NationalRegistryXRoadService,
          useClass: jest.fn(() => ({
            getNationalRegistryResidenceHistory: () => ResidenceHistory,
          })),
        },
      ],
    }).compile()

    service = module.get(DrivingLicenseService)
  })

  describe('Module', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('getDrivingLicense', () => {
    it('should return a license', async () => {
      const response = await service.legacyGetDrivingLicense(MOCK_NATIONAL_ID)
      expect(response).toMatchObject({
        name: 'Valid Jónsson',
        issued: new Date('2018-05-25T06:43:15.327Z'),
        expires: new Date('2036-05-25T06:43:15.327Z'),
      })
    })

    it('should not return an expired license', async () => {
      const response = await service.legacyGetDrivingLicense(
        MOCK_NATIONAL_ID_EXPIRED,
      )

      expect(response).toBeNull()
    })
  })

  describe('getStudentInformation', () => {
    it("should return a student's name", async () => {
      const response = await service.getStudentInformation(MOCK_NATIONAL_ID)

      expect(response).toStrictEqual({
        name: 'Valid Jónsson',
      })
    })

    it("_should_ return a student's license when expired", async () => {
      // Reason:
      // It is allowed to look up stundents and mark them as having finished
      // the driving assessment even though their license is expired.
      const response = await service.getStudentInformation(
        MOCK_NATIONAL_ID_EXPIRED,
      )

      expect(response).toStrictEqual({
        name: 'Expired Halldórsson',
      })
    })
  })

  describe('getTeachingRights', () => {
    it('should return false for a normal license', async () => {
      const response = await service.getTeachingRights({
        nationalId: MOCK_NATIONAL_ID,
        token: MOCK_TOKEN,
      })

      expect(response).toStrictEqual({
        nationalId: MOCK_NATIONAL_ID,
        hasTeachingRights: false,
      })
    })

    it('should return true for a teacher', async () => {
      const response = await service.getTeachingRights({
        nationalId: MOCK_NATIONAL_ID_TEACHER,
        token: MOCK_TOKEN_TEACHER,
      })

      expect(response).toStrictEqual({
        nationalId: MOCK_NATIONAL_ID_TEACHER,
        hasTeachingRights: true,
      })
    })
  })

  describe('getTeachers', () => {
    it('should return a list', async () => {
      const response = await service.getTeachersV4()

      expect(response).toHaveLength(2)

      expect(response).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Jóna Jónsdóttir',
            nationalId: '1234567890',
          }),
        ]),
      )
    })
  })

  describe('getDrivingAssessmentResult', () => {
    it('should return a valid assessment when applicable', async () => {
      const response = await service.getDrivingAssessment(
        MOCK_USER.authorization,
      )

      expect(response).toStrictEqual({
        studentNationalId: MOCK_NATIONAL_ID,
        teacherNationalId: MOCK_NATIONAL_ID_TEACHER,
        teacherName: 'Valid Jónsson',
      })
    })

    it('should return null for missing assessment', async () => {
      const response = await service.getDrivingAssessment(
        MOCK_TOKEN_NO_ASSESSMENT,
      )

      expect(response).toStrictEqual(null)
    })
  })

  describe('getLearnerMentorEligibility', () => {
    it('should not disqualify for disqualifications older than 12 months', async () => {
      const MOCK_USER_COPY = { ...MOCK_USER }
      MOCK_USER_COPY.authorization = DISQUALIFIED_TOKENS[2]
      const response = await service.getLearnerMentorEligibility(
        MOCK_USER_COPY,
        DISQUALIFIED_NATIONAL_IDS[2],
      )
      expect(response).toStrictEqual({
        isEligible: true,
        requirements: [
          {
            key: 'HasDeprivation',
            requirementMet: true,
          },
          {
            key: 'PersonNotAtLeast24YearsOld',
            requirementMet: true,
          },
          {
            key: 'HasHadValidCategoryForFiveYearsOrMore',
            requirementMet: true,
          },
        ],
      })
    })

    it('should disqualify for expired disqualifications that happened less than 12 months ago', async () => {
      const response = await service.getLearnerMentorEligibility(
        MOCK_USER,
        DISQUALIFIED_NATIONAL_IDS[1],
      )
      expect(response).toStrictEqual({
        isEligible: false,
        requirements: [
          {
            key: 'HasDeprivation',
            requirementMet: false,
          },
          {
            key: 'PersonNotAtLeast24YearsOld',
            requirementMet: true,
          },
          {
            key: 'HasHadValidCategoryForFiveYearsOrMore',
            requirementMet: true,
          },
        ],
      })
    })

    it('should disqualify for active disqualifications', async () => {
      const response = await service.getLearnerMentorEligibility(
        MOCK_USER,
        DISQUALIFIED_NATIONAL_IDS[0],
      )
      expect(response).toStrictEqual({
        isEligible: false,
        requirements: [
          {
            key: 'HasDeprivation',
            requirementMet: false,
          },
          {
            key: 'PersonNotAtLeast24YearsOld',
            requirementMet: true,
          },
          {
            key: 'HasHadValidCategoryForFiveYearsOrMore',
            requirementMet: true,
          },
        ],
      })
    })

    it('should disqualify for disqualifications with a from date, but no specified end date', async () => {
      const response = await service.getLearnerMentorEligibility(
        MOCK_USER,
        DISQUALIFIED_NATIONAL_IDS[0],
      )
      expect(response).toStrictEqual({
        isEligible: false,
        requirements: [
          {
            key: 'HasDeprivation',
            requirementMet: false,
          },
          {
            key: 'PersonNotAtLeast24YearsOld',
            requirementMet: true,
          },
          {
            key: 'HasHadValidCategoryForFiveYearsOrMore',
            requirementMet: true,
          },
        ],
      })
    })
  })

  describe('getApplicationEligibility', () => {
    it('all checks should pass for applicable students', async () => {
      const response = await service.getApplicationEligibility(
        MOCK_USER,
        MOCK_NATIONAL_ID,
        'B-full',
      )

      expect(response).toStrictEqual({
        isEligible: true,
        requirements: [
          {
            key: 'DrivingAssessmentMissing',
            requirementMet: true,
          },
          {
            key: 'DrivingSchoolMissing',
            requirementMet: true,
          },
          {
            key: 'CurrentLocalResidency',
            daysOfResidency,
            requirementMet: true,
          },
          {
            key: 'DeniedByService',
            requirementMet: true,
          },
        ],
      })
    })

    it('all checks should pass for applicable students for temporary license', async () => {
      const response = await service.getApplicationEligibility(
        MOCK_USER,
        MOCK_NATIONAL_ID,
        'B-temp',
      )

      expect(response).toStrictEqual({
        isEligible: true,
        requirements: [
          {
            key: 'LocalResidency',
            daysOfResidency,
            requirementMet: true,
          },
          {
            key: 'DeniedByService',
            requirementMet: true,
          },
        ],
      })
    })

    it('checks should fail for non-applicable students', async () => {
      const MOCK_USER_COPY = { ...MOCK_USER }
      MOCK_USER_COPY.authorization = MOCK_TOKEN_EXPIRED
      const response = await service.getApplicationEligibility(
        MOCK_USER_COPY,
        MOCK_NATIONAL_ID_EXPIRED,
        'B-full',
      )

      expect(response).toStrictEqual({
        isEligible: false,
        requirements: [
          {
            key: 'DrivingAssessmentMissing',
            requirementMet: true,
          },
          {
            key: 'DrivingSchoolMissing',
            requirementMet: false,
          },
          {
            key: 'CurrentLocalResidency',
            daysOfResidency,
            requirementMet: true,
          },
          {
            key: 'DeniedByService',
            requirementMet: false,
          },
        ],
      })
    })
  })

  describe('newDrivingAssessment', () => {
    it('teacher should be able to create a driving assessment', async () => {
      const response = await service.newDrivingAssessment(
        MOCK_NATIONAL_ID,
        MOCK_NATIONAL_ID_TEACHER,
      )

      expect(response).toStrictEqual({
        success: true,
        errorMessage: null,
      })
    })

    it('somebody else should not be able to create a driving assessment', async () => {
      expect.assertions(1)

      return service
        .newDrivingAssessment(MOCK_NATIONAL_ID, MOCK_NATIONAL_ID_EXPIRED)
        .catch((e) => expect(e).toBeTruthy())
    })
  })

  describe('newDrivingLicense', () => {
    it('should handle driving license creation', async () => {
      const response = await service.newDrivingLicense(MOCK_NATIONAL_ID, {
        jurisdictionId: 11,
        needsToPresentHealthCertificate: false,
        needsToPresentQualityPhoto: false,
        licenseCategory: DrivingLicenseCategory.B,
        sendLicenseInMail: 0,
      })

      expect(response).toStrictEqual({
        success: true,
        errorMessage: null,
      })
    })

    it('should handle error responses when creating a license', async () => {
      expect.assertions(1)

      return service
        .newDrivingLicense(MOCK_NATIONAL_ID_NO_ASSESSMENT, {
          jurisdictionId: 11,
          needsToPresentHealthCertificate: false,
          needsToPresentQualityPhoto: true,
          licenseCategory: DrivingLicenseCategory.B,
          sendLicenseInMail: 0,
        })
        .catch((e) => expect(e).toBeTruthy())
    })
  })

  describe('newTemporaryDrivingLicense', () => {
    it('should handle driving license creation', async () => {
      const response = await service.newTemporaryDrivingLicense(
        MOCK_NATIONAL_ID,
        MOCK_USER.authorization,
        {
          jurisdictionId: 11,
          needsToPresentHealthCertificate: false,
          needsToPresentQualityPhoto: false,
          teacherNationalId: MOCK_NATIONAL_ID_TEACHER,
          email: 'mock@email.com',
          phone: '9999999',
          sendLicenseInMail: false,
        },
      )

      expect(response).toStrictEqual({
        success: true,
        errorMessage: null,
      })
    })

    it('should handle error responses when creating a license', async () => {
      return await service
        .newTemporaryDrivingLicense(
          MOCK_NATIONAL_ID_NO_ASSESSMENT,
          MOCK_USER.authorization,
          {
            jurisdictionId: 11,
            needsToPresentHealthCertificate: false,
            needsToPresentQualityPhoto: true,
            teacherNationalId: MOCK_NATIONAL_ID_TEACHER,
            email: 'mock@email.com',
            phone: '9999999',
            sendLicenseInMail: false,
          },
        )
        .catch((e) => expect(e).toBeTruthy())
    })
  })
})
