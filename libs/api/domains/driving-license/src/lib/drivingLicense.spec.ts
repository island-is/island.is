import { Test } from '@nestjs/testing'
import { DrivingLicenseService } from './drivingLicense.service'
import {
  Configuration,
  IDrivingLicenseApiV1,
  OkuskirteiniApi as OkuskirteiniApiV1,
} from '@island.is/clients/driving-license-v1'
import {
  Configuration as ConfigurationV2,
  IDrivingLicenseApiV2,
  OkuskirteiniApi as OkuskirteiniApiV2,
} from '@island.is/clients/driving-license-v2'
import {
  MOCK_NATIONAL_ID,
  MOCK_NATIONAL_ID_EXPIRED,
  MOCK_NATIONAL_ID_NO_ASSESSMENT,
  MOCK_NATIONAL_ID_TEACHER,
  requestHandlers,
} from './__mock-data__/requestHandlers'
import { startMocking } from '@island.is/shared/mocking'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { createLogger } from 'winston'

startMocking(requestHandlers)

const fetch = createEnhancedFetch({
  name: 'api-domains-driving-license-test-run',
  logger: createLogger({
    silent: true,
  }),
})

const MockOkuskirteiniApiV1 = new OkuskirteiniApiV1(
  new Configuration({
    fetchApi: fetch,
  }),
)

const MockOkuskirteiniApiV2 = new OkuskirteiniApiV2(
  new ConfigurationV2({
    fetchApi: fetch,
  }),
)

describe('DrivingLicenseService', () => {
  let service: DrivingLicenseService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: IDrivingLicenseApiV1,
          useValue: MockOkuskirteiniApiV1,
        },
        {
          provide: IDrivingLicenseApiV2,
          useValue: MockOkuskirteiniApiV2,
        },
        DrivingLicenseService,
        { provide: 'CONFIG', useValue: {} },
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
      const response = await service.getDrivingLicense(MOCK_NATIONAL_ID)

      expect(response).toMatchObject({
        name: 'Valid Jónsson',
        issued: new Date('2021-05-25T06:43:15.327Z'),
        expires: new Date('2036-05-25T06:43:15.327Z'),
      })
    })

    it('should return an expired license', async () => {
      const response = await service.getDrivingLicense(MOCK_NATIONAL_ID_EXPIRED)

      expect(response).toMatchObject({
        name: 'Expired Halldórsson',
        expires: new Date('1997-05-25T06:43:15.327Z'),
      })

      expect(response?.expires?.getTime()).toBeLessThan(Date.now())
    })
  })

  describe('getStudentInformation', () => {
    it("should return a student's name", async () => {
      const response = await service.getStudentInformation(MOCK_NATIONAL_ID)

      expect(response).toStrictEqual({
        name: 'Valid Jónsson',
      })
    })

    it("should return a student's license despite expiry", async () => {
      const response = await service.getStudentInformation(
        MOCK_NATIONAL_ID_EXPIRED,
      )

      expect(response).toMatchObject({
        name: 'Expired Halldórsson',
      })
    })
  })

  describe('getTeachingRights', () => {
    it('should return false for a normal license', async () => {
      const response = await service.getTeachingRights(MOCK_NATIONAL_ID)

      expect(response).toStrictEqual({
        nationalId: MOCK_NATIONAL_ID,
        hasTeachingRights: false,
      })
    })

    it('should return true for a teacher', async () => {
      const response = await service.getTeachingRights(MOCK_NATIONAL_ID_TEACHER)

      expect(response).toStrictEqual({
        nationalId: MOCK_NATIONAL_ID_TEACHER,
        hasTeachingRights: true,
      })
    })
  })

  describe('getListOfJuristictions', () => {
    it('should return a list', async () => {
      const response = await service.getListOfJuristictions()

      expect(response).toHaveLength(24)

      expect(response).toContainEqual({
        id: 21,
        name: 'Sýslumaðurinn á Norðurlandi vestra - Sauðárkróki',
        zip: 550,
      })
    })

    it('should not include juristiction nr 11', async () => {
      const response = await service.getListOfJuristictions()

      expect(response.find(({ id }) => id === 11)).toBeUndefined()
    })
  })

  describe('getTeachers', () => {
    it('should return a list', async () => {
      const response = await service.getTeachers()

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
      const response = await service.getDrivingAssessment(MOCK_NATIONAL_ID)

      expect(response).toStrictEqual({
        studentNationalId: MOCK_NATIONAL_ID,
        teacherNationalId: MOCK_NATIONAL_ID_TEACHER,
        teacherName: 'Valid Jónsson',
      })
    })

    it('should return null for missing assessment', async () => {
      const response = await service.getDrivingAssessment(
        MOCK_NATIONAL_ID_NO_ASSESSMENT,
      )

      expect(response).toStrictEqual(null)
    })
  })

  describe('getApplicationEligibility', () => {
    it('all checks should pass for applicable students', async () => {
      const response = await service.getApplicationEligibility(
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
            key: 'DeniedByService',
            requirementMet: true,
          },
        ],
      })
    })

    it('all checks should pass for applicable students for temporary license', async () => {
      const response = await service.getApplicationEligibility(
        MOCK_NATIONAL_ID,
        'B-temp',
      )

      expect(response).toStrictEqual({
        isEligible: true,
        requirements: [
          {
            key: 'LocalResidency',
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
      const response = await service.getApplicationEligibility(
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
        juristictionId: 11,
        needsToPresentHealthCertificate: false,
        needsToPresentQualityPhoto: false,
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
          juristictionId: 11,
          needsToPresentHealthCertificate: false,
          needsToPresentQualityPhoto: true,
        })
        .catch((e) => expect(e).toBeTruthy())
    })
  })

  describe('newTemporaryDrivingLicense', () => {
    it('should handle driving license creation', async () => {
      const response = await service.newTemporaryDrivingLicense(
        MOCK_NATIONAL_ID,
        {
          juristictionId: 11,
          needsToPresentHealthCertificate: false,
          needsToPresentQualityPhoto: false,
          teacherNationalId: MOCK_NATIONAL_ID_TEACHER,
        },
      )

      expect(response).toStrictEqual({
        success: true,
        errorMessage: null,
      })
    })

    it('should handle error responses when creating a license', async () => {
      expect.assertions(1)

      return service
        .newTemporaryDrivingLicense(MOCK_NATIONAL_ID_NO_ASSESSMENT, {
          juristictionId: 11,
          needsToPresentHealthCertificate: false,
          needsToPresentQualityPhoto: true,
          teacherNationalId: MOCK_NATIONAL_ID_TEACHER,
        })
        .catch((e) => expect(e).toBeTruthy())
    })
  })
})
