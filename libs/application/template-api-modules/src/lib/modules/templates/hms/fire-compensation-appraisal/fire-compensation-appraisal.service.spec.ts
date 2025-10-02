import { Test, TestingModule } from '@nestjs/testing'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { createApplication } from '@island.is/application/testing'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { FasteignirApi } from '@island.is/clients/assets'
import { ApplicationApi } from '@island.is/clients/hms-application-system'
import { AttachmentS3Service } from '../../../shared/services'
import { FireCompensationAppraisalService } from './fire-compensation-appraisal.service'
import { mockGetProperties, getMockedFasteign } from './mockedFasteign'
import { TemplateApiError } from '@island.is/nest/problem'

// Mock the environment utility
jest.mock('@island.is/shared/utils', () => ({
  isRunningOnEnvironment: jest.fn(),
}))

import { isRunningOnEnvironment } from '@island.is/shared/utils'

const mockIsRunningOnEnvironment =
  isRunningOnEnvironment as jest.MockedFunction<typeof isRunningOnEnvironment>

describe('FireCompensationAppraisalService', () => {
  let service: FireCompensationAppraisalService
  let propertiesApi: FasteignirApi
  let hmsApplicationSystemService: ApplicationApi
  let attachmentService: AttachmentS3Service
  let module: TestingModule

  // Mock console methods to suppress noise during tests
  let consoleLogSpy: jest.SpyInstance
  let consoleDirSpy: jest.SpyInstance

  const createMockPropertiesApi = () => ({
    fasteignirGetFasteignir: jest.fn(),
    fasteignirGetFasteign: jest.fn(),
    withMiddleware: jest.fn().mockReturnThis(),
  })

  const createMockHmsApplicationSystemService = () => ({
    apiApplicationPost: jest.fn(),
    apiApplicationUploadPost: jest.fn(),
  })

  const createMockAttachmentService = () => ({
    getFiles: jest.fn(),
  })

  // Mock logger to suppress winston output
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
    log: jest.fn(),
  }

  beforeAll(() => {
    // Suppress console output during tests
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    consoleDirSpy = jest.spyOn(console, 'dir').mockImplementation()
  })

  afterAll(() => {
    // Restore console methods
    consoleLogSpy.mockRestore()
    consoleDirSpy.mockRestore()
  })

  beforeEach(async () => {
    jest.clearAllMocks()

    module = await Test.createTestingModule({
      providers: [
        FireCompensationAppraisalService,
        {
          provide: LOGGER_PROVIDER,
          useValue: mockLogger,
        },
        {
          provide: FasteignirApi,
          useFactory: createMockPropertiesApi,
        },
        {
          provide: ApplicationApi,
          useFactory: createMockHmsApplicationSystemService,
        },
        {
          provide: AttachmentS3Service,
          useFactory: createMockAttachmentService,
        },
      ],
    }).compile()

    service = module.get<FireCompensationAppraisalService>(
      FireCompensationAppraisalService,
    )
    propertiesApi = module.get<FasteignirApi>(FasteignirApi)
    hmsApplicationSystemService = module.get<ApplicationApi>(ApplicationApi)
    attachmentService = module.get<AttachmentS3Service>(AttachmentS3Service)
  })

  afterEach(async () => {
    // Clean up the testing module to prevent memory leaks
    if (module) {
      await module.close()
    }
  })

  describe('getProperties', () => {
    it('should return mocked properties in local environment', async () => {
      mockIsRunningOnEnvironment.mockImplementation(
        (env) => env === 'local' || env === 'dev',
      )

      const user = createCurrentUser()
      const application = createApplication({
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const result = await service.getProperties({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(result).toEqual(mockGetProperties())
      expect(result.length).toBeGreaterThan(0)
    })

    it('should fetch properties from API in production environment', async () => {
      mockIsRunningOnEnvironment.mockReturnValue(false)

      const user = createCurrentUser()
      const application = createApplication({
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })
      const mockProperties = mockGetProperties()

      jest.spyOn(propertiesApi, 'withMiddleware').mockReturnValue(propertiesApi)
      jest.spyOn(propertiesApi, 'fasteignirGetFasteignir').mockResolvedValue({
        fasteignir: [
          { fasteignanumer: 'F2240134' },
          { fasteignanumer: 'F2213525' },
        ],
      })
      jest
        .spyOn(propertiesApi, 'fasteignirGetFasteign')
        .mockResolvedValueOnce(mockProperties[0])
        .mockResolvedValueOnce(mockProperties[1])

      const result = await service.getProperties({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      expect(result).toHaveLength(2)
      expect(propertiesApi.fasteignirGetFasteignir).toHaveBeenCalledWith({
        kennitala: user.nationalId,
      })
      expect(propertiesApi.fasteignirGetFasteign).toHaveBeenCalledTimes(2)
      expect(propertiesApi.fasteignirGetFasteign).toHaveBeenCalledWith({
        fasteignanumer: '2240134',
      })
      expect(propertiesApi.fasteignirGetFasteign).toHaveBeenCalledWith({
        fasteignanumer: '2213525',
      })
    })

    it('should handle API errors and throw TemplateApiError', async () => {
      mockIsRunningOnEnvironment.mockReturnValue(false)

      const user = createCurrentUser()
      const application = createApplication({
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      jest.spyOn(propertiesApi, 'withMiddleware').mockReturnValue(propertiesApi)
      jest
        .spyOn(propertiesApi, 'fasteignirGetFasteignir')
        .mockRejectedValue(new Error('API Error'))

      await expect(
        service.getProperties({
          application,
          auth: user,
          currentUserLocale: 'is',
        }),
      ).rejects.toThrow(TemplateApiError)
    })

    it('should throw error when no properties found', async () => {
      mockIsRunningOnEnvironment.mockReturnValue(false)

      const user = createCurrentUser()
      const application = createApplication({
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      jest.spyOn(propertiesApi, 'withMiddleware').mockReturnValue(propertiesApi)
      jest.spyOn(propertiesApi, 'fasteignirGetFasteignir').mockResolvedValue({
        fasteignir: [],
      })

      await expect(
        service.getProperties({
          application,
          auth: user,
          currentUserLocale: 'is',
        }),
      ).rejects.toThrow(TemplateApiError)
    })

    it('should handle properties with undefined fasteignir array', async () => {
      mockIsRunningOnEnvironment.mockReturnValue(false)

      const user = createCurrentUser()
      const application = createApplication({
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      jest.spyOn(propertiesApi, 'withMiddleware').mockReturnValue(propertiesApi)
      jest.spyOn(propertiesApi, 'fasteignirGetFasteignir').mockResolvedValue({
        fasteignir: undefined,
      })

      await expect(
        service.getProperties({
          application,
          auth: user,
          currentUserLocale: 'is',
        }),
      ).rejects.toThrow(TemplateApiError)
    })
  })

  describe('calculateAmount', () => {
    it('should calculate correct amount for selected usage units', async () => {
      const user = createCurrentUser()
      const mockProperties = mockGetProperties()
      const application = createApplication({
        answers: {
          realEstate: 'F2213525',
          usageUnits: ['010102', '010103'],
        },
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      jest.spyOn(service, 'getProperties').mockResolvedValue(mockProperties)

      const result = await service.calculateAmount({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      // Based on mocked data: 70000000 + 91204000 = 161204000
      // Payment should be 0.03% of 161204000 = 48361.2 rounded = 48361
      expect(result).toBe(48361)
    })

    it('should calculate payment for appraisal less than 25 million', async () => {
      const user = createCurrentUser()
      const smallProperty = getMockedFasteign(
        'Test Address, 101 Reykjavík',
        'F1234567',
        [
          {
            notkunBirting: 'Íbúð',
            brunabotamat: 10000000,
            notkunareininganumer: '010107',
          },
        ],
      )

      const application = createApplication({
        answers: {
          realEstate: 'F1234567',
          usageUnits: ['010107'],
        },
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      jest.spyOn(service, 'getProperties').mockResolvedValue([smallProperty])

      const result = await service.calculateAmount({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      // Less than 25 million = 6000kr
      expect(result).toBe(6000)
    })

    it('should calculate payment for appraisal greater than 500 million', async () => {
      const user = createCurrentUser()
      const largeProperty = getMockedFasteign(
        'Large Estate, 101 Reykjavík',
        'F9999999',
        [
          {
            notkunBirting: 'Stór eign',
            brunabotamat: 600000000,
            notkunareininganumer: '010108',
          },
        ],
      )

      const application = createApplication({
        answers: {
          realEstate: 'F9999999',
          usageUnits: ['010108'],
        },
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      jest.spyOn(service, 'getProperties').mockResolvedValue([largeProperty])

      const result = await service.calculateAmount({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      // Greater than 500 million = 0.01% = 60000
      expect(result).toBe(60000)
    })

    it('should handle multiple usage units with different appraisal amounts', async () => {
      const user = createCurrentUser()
      const mockProperties = mockGetProperties()
      const application = createApplication({
        answers: {
          realEstate: 'F2038399',
          usageUnits: ['010104', '010105', '010106'],
        },
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      jest.spyOn(service, 'getProperties').mockResolvedValue(mockProperties)

      const result = await service.calculateAmount({
        application,
        auth: user,
        currentUserLocale: 'is',
      })

      // 50000000 + 7300000 + 8600000 = 65900000
      // 0.03% of 65900000 = 19770
      expect(result).toBe(19770)
    })

    it('should handle errors and throw TemplateApiError', async () => {
      const user = createCurrentUser()
      const application = createApplication({
        answers: {
          realEstate: 'F2213525',
          usageUnits: ['010102'],
        },
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      jest
        .spyOn(service, 'getProperties')
        .mockRejectedValue(new Error('API Error'))

      await expect(
        service.calculateAmount({
          application,
          auth: user,
          currentUserLocale: 'is',
        }),
      ).rejects.toThrow(TemplateApiError)
    })
  })

  describe('submitApplication', () => {
    it('should successfully submit application with valid files', async () => {
      const application = createApplication({
        id: 'test-app-id',
        answers: {
          applicant: {
            name: 'Test User',
            nationalId: '1234567890',
            email: 'test@test.is',
            phoneNumber: '1234567',
            address: 'Test Street 1',
            postalCode: '101',
            city: 'Reykjavík',
          },
          realEstate: 'F2213525',
          usageUnits: ['010102'],
          confirmReadFireCompensationInfo: ['yes'],
          confirmReadPrivacyPolicy: ['yes'],
          appraisalMethod: ['renovations'],
          description: 'Test description',
          photos: [
            { key: 'photo1_test.jpg', name: 'test.jpg' },
            { key: 'photo2_test2.jpg', name: 'test2.jpg' },
          ],
        },
        externalData: {
          getProperties: {
            data: mockGetProperties(),
            date: new Date(),
            status: 'success',
          },
        },
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const mockFiles = [
        {
          key: 'photo1_test.jpg',
          answerKey: 'photos',
          fileContent: 'base64encodedcontent1',
          fileName: 'test.jpg',
        },
        {
          key: 'photo2_test2.jpg',
          answerKey: 'photos',
          fileContent: 'base64encodedcontent2',
          fileName: 'test2.jpg',
        },
      ]

      jest.spyOn(attachmentService, 'getFiles').mockResolvedValue(mockFiles)
      jest
        .spyOn(hmsApplicationSystemService, 'apiApplicationPost')
        .mockResolvedValue({
          status: 200,
        } as any)
      jest
        .spyOn(hmsApplicationSystemService, 'apiApplicationUploadPost')
        .mockResolvedValue({ status: 200 } as any)

      const result = await service.submitApplication({
        application,
        auth: createCurrentUser(),
        currentUserLocale: 'is',
      })

      expect(attachmentService.getFiles).toHaveBeenCalledWith(application, [
        'photos',
      ])
      expect(hmsApplicationSystemService.apiApplicationPost).toHaveBeenCalled()
      expect(
        hmsApplicationSystemService.apiApplicationUploadPost,
      ).toHaveBeenCalledTimes(2)
      expect(result.status).toBe(200)
    })

    it('should throw error when files have missing content', async () => {
      const application = createApplication({
        answers: {
          photos: [{ key: 'photo1_test.jpg', name: 'test.jpg' }],
        },
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const mockFiles = [
        {
          key: 'photo1_test.jpg',
          answerKey: 'photos',
          fileContent: '', // Empty content
          fileName: 'test.jpg',
        },
      ]

      jest.spyOn(attachmentService, 'getFiles').mockResolvedValue(mockFiles)

      await expect(
        service.submitApplication({
          application,
          auth: createCurrentUser(),
          currentUserLocale: 'is',
        }),
      ).rejects.toThrow(TemplateApiError)
    })

    it('should throw error when files have whitespace-only content', async () => {
      const application = createApplication({
        answers: {
          photos: [{ key: 'photo1_test.jpg', name: 'test.jpg' }],
        },
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const mockFiles = [
        {
          key: 'photo1_test.jpg',
          answerKey: 'photos',
          fileContent: '   ', // Whitespace only
          fileName: 'test.jpg',
        },
      ]

      jest.spyOn(attachmentService, 'getFiles').mockResolvedValue(mockFiles)

      await expect(
        service.submitApplication({
          application,
          auth: createCurrentUser(),
          currentUserLocale: 'is',
        }),
      ).rejects.toThrow(TemplateApiError)
    })

    it('should throw error when some files have missing content', async () => {
      const application = createApplication({
        answers: {
          photos: [
            { key: 'photo1_test.jpg', name: 'test.jpg' },
            { key: 'photo2_test2.jpg', name: 'test2.jpg' },
          ],
        },
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const mockFiles = [
        {
          key: 'photo1_test.jpg',
          answerKey: 'photos',
          fileContent: 'validcontent',
          fileName: 'test.jpg',
        },
        {
          key: 'photo2_test2.jpg',
          answerKey: 'photos',
          fileContent: '', // Empty content
          fileName: 'test2.jpg',
        },
      ]

      jest.spyOn(attachmentService, 'getFiles').mockResolvedValue(mockFiles)

      await expect(
        service.submitApplication({
          application,
          auth: createCurrentUser(),
          currentUserLocale: 'is',
        }),
      ).rejects.toThrow(TemplateApiError)
    })

    it('should throw error when application post returns non-200 status', async () => {
      const application = createApplication({
        id: 'test-app-id',
        answers: {
          applicant: {
            name: 'Test User',
            nationalId: '1234567890',
            email: 'test@test.is',
            phoneNumber: '1234567',
            address: 'Test Street 1',
            postalCode: '101',
            city: 'Reykjavík',
          },
          photos: [{ key: 'photo1_test.jpg', name: 'test.jpg' }],
        },
        externalData: {
          getProperties: {
            data: mockGetProperties(),
            date: new Date(),
            status: 'success',
          },
        },
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const mockFiles = [
        {
          key: 'photo1_test.jpg',
          answerKey: 'photos',
          fileContent: 'base64encodedcontent',
          fileName: 'test.jpg',
        },
      ]

      jest.spyOn(attachmentService, 'getFiles').mockResolvedValue(mockFiles)
      jest
        .spyOn(hmsApplicationSystemService, 'apiApplicationPost')
        .mockResolvedValue({
          status: 500,
        } as any)

      await expect(
        service.submitApplication({
          application,
          auth: createCurrentUser(),
          currentUserLocale: 'is',
        }),
      ).rejects.toThrow(TemplateApiError)
    })

    it('should throw error when photo upload returns non-200 status', async () => {
      const application = createApplication({
        id: 'test-app-id',
        answers: {
          applicant: {
            name: 'Test User',
            nationalId: '1234567890',
            email: 'test@test.is',
            phoneNumber: '1234567',
            address: 'Test Street 1',
            postalCode: '101',
            city: 'Reykjavík',
          },
          photos: [
            { key: 'photo1_test.jpg', name: 'test.jpg' },
            { key: 'photo2_test2.jpg', name: 'test2.jpg' },
          ],
        },
        externalData: {
          getProperties: {
            data: mockGetProperties(),
            date: new Date(),
            status: 'success',
          },
        },
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      const mockFiles = [
        {
          key: 'photo1_test.jpg',
          answerKey: 'photos',
          fileContent: 'base64encodedcontent1',
          fileName: 'test.jpg',
        },
        {
          key: 'photo2_test2.jpg',
          answerKey: 'photos',
          fileContent: 'base64encodedcontent2',
          fileName: 'test2.jpg',
        },
      ]

      jest.spyOn(attachmentService, 'getFiles').mockResolvedValue(mockFiles)
      jest
        .spyOn(hmsApplicationSystemService, 'apiApplicationPost')
        .mockResolvedValue({
          status: 200,
        } as any)
      jest
        .spyOn(hmsApplicationSystemService, 'apiApplicationUploadPost')
        .mockResolvedValueOnce({ status: 200 } as any)
        .mockResolvedValueOnce({ status: 500 } as any) // Second upload fails

      await expect(
        service.submitApplication({
          application,
          auth: createCurrentUser(),
          currentUserLocale: 'is',
        }),
      ).rejects.toThrow(TemplateApiError)
    })

    it('should handle general errors and throw TemplateApiError', async () => {
      const application = createApplication({
        answers: {
          photos: [{ key: 'photo1_test.jpg', name: 'test.jpg' }],
        },
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      jest
        .spyOn(attachmentService, 'getFiles')
        .mockRejectedValue(new Error('S3 Error'))

      await expect(
        service.submitApplication({
          application,
          auth: createCurrentUser(),
          currentUserLocale: 'is',
        }),
      ).rejects.toThrow(TemplateApiError)
    })

    it('should handle empty files array', async () => {
      const application = createApplication({
        id: 'test-app-id',
        answers: {
          applicant: {
            name: 'Test User',
            nationalId: '1234567890',
            email: 'test@test.is',
            phoneNumber: '1234567',
            address: 'Test Street 1',
            postalCode: '101',
            city: 'Reykjavík',
          },
        },
        externalData: {
          getProperties: {
            data: mockGetProperties(),
            date: new Date(),
            status: 'success',
          },
        },
        typeId: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
        status: ApplicationStatus.IN_PROGRESS,
      })

      jest.spyOn(attachmentService, 'getFiles').mockResolvedValue([])
      jest
        .spyOn(hmsApplicationSystemService, 'apiApplicationPost')
        .mockResolvedValue({
          status: 200,
        } as any)

      const result = await service.submitApplication({
        application,
        auth: createCurrentUser(),
        currentUserLocale: 'is',
      })

      expect(result.status).toBe(200)
      expect(
        hmsApplicationSystemService.apiApplicationUploadPost,
      ).not.toHaveBeenCalled()
    })
  })
})
