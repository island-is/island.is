import { Test, TestingModule } from '@nestjs/testing'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { PassportService } from './passport.service'
import { SharedTemplateApiService } from '../../shared'
import { PassportsService } from '@island.is/clients/passports'
import { TemplateApiError } from '@island.is/nest/problem'
import { ApplicationTypes } from '@island.is/application/types'
import { createApplication } from '@island.is/application/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import type { Locale } from '@island.is/shared/types'

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
}

const mockSharedTemplateApiService = {
  getPaymentStatus: jest.fn(),
}

const mockPassportsService = {
  getCurrentPassport: jest.fn(),
  preregisterIdentityDocument: jest.fn(),
  preregisterChildIdentityDocument: jest.fn(),
}

describe('PassportService - ExpiresWithinNoticeTime Validation', () => {
  let service: PassportService
  let module: TestingModule

  const mockAuth = createCurrentUser({
    nationalId: '1234567890',
    scope: ['@island.is/applications:write'],
  })

  const createMockApplication = (
    forUser = true,
    childNationalId = '0987654321',
  ) => {
    return createApplication({
      typeId: ApplicationTypes.PASSPORT,
      answers: {
        approveExternalData: true,
        passport: forUser ? { userPassport: 'yes' } : { childPassport: 'yes' },
        personalInfo: {
          name: 'Test User',
          nationalId: '1234567890',
          email: 'test@example.com',
          phoneNumber: '5812345',
        },
        childsPersonalInfo: {
          name: 'Test Child',
          nationalId: childNationalId,
          guardian1: {
            name: 'Guardian One',
            nationalId: '1234567890',
            email: 'guardian@example.com',
            phoneNumber: '5812345',
          },
        },
        service: {
          type: 'regular',
        },
        chargeItemCode: 'AY110',
      },
    })
  }

  const childNationalId = '0987654321'
  const applicationForUser = createMockApplication(true)
  const applicationForChild = createMockApplication(false, childNationalId)

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        PassportService,
        {
          provide: LOGGER_PROVIDER,
          useValue: mockLogger,
        },
        {
          provide: SharedTemplateApiService,
          useValue: mockSharedTemplateApiService,
        },
        {
          provide: PassportsService,
          useValue: mockPassportsService,
        },
      ],
    }).compile()
    service = module.get<PassportService>(PassportService)
  })

  beforeEach(() => {
    // Default mock for payment status (always fulfilled)
    mockSharedTemplateApiService.getPaymentStatus.mockResolvedValue({
      fulfilled: true,
    })

    // Default success response for preregistration
    mockPassportsService.preregisterIdentityDocument.mockResolvedValue({
      success: true,
      orderId: ['123'],
    })
    mockPassportsService.preregisterChildIdentityDocument.mockResolvedValue({
      success: true,
      orderId: ['456'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await module.close()
  })

  describe('User Passport Expiration Validation', () => {
    it('should allow submission when user passport expires within notice time', async () => {
      mockPassportsService.getCurrentPassport.mockResolvedValue({
        userPassport: {
          number: 'A1234567',
          expiresWithinNoticeTime: true,
        },
      })

      const result = await service.submitPassportApplication({
        application: applicationForUser,
        auth: mockAuth,
        currentUserLocale: 'is' as Locale,
      })

      expect(result.success).toBe(true)
      expect(
        mockPassportsService.preregisterIdentityDocument,
      ).toHaveBeenCalled()
    })

    it('should allow submission when user passport does not exist', async () => {
      mockPassportsService.getCurrentPassport.mockResolvedValue({
        userPassport: undefined,
      })

      const result = await service.submitPassportApplication({
        application: applicationForUser,
        auth: mockAuth,
        currentUserLocale: 'is' as Locale,
      })

      expect(result.success).toBe(true)
      expect(
        mockPassportsService.preregisterIdentityDocument,
      ).toHaveBeenCalled()
    })

    it('should throw TemplateApiError when user passport exists but does not expire within notice time', async () => {
      mockPassportsService.getCurrentPassport.mockResolvedValue({
        userPassport: {
          number: 'A1234567',
          expiresWithinNoticeTime: false,
        },
      })

      await expect(
        service.submitPassportApplication({
          application: applicationForUser,
          auth: mockAuth,
          currentUserLocale: 'is' as Locale,
        }),
      ).rejects.toThrow(TemplateApiError)

      expect(
        mockPassportsService.preregisterIdentityDocument,
      ).not.toHaveBeenCalled()
    })

    it('should allow submission when user passport is null', async () => {
      mockPassportsService.getCurrentPassport.mockResolvedValue({
        userPassport: null,
      })

      const result = await service.submitPassportApplication({
        application: applicationForUser,
        auth: mockAuth,
        currentUserLocale: 'is' as Locale,
      })

      expect(result.success).toBe(true)
      expect(
        mockPassportsService.preregisterIdentityDocument,
      ).toHaveBeenCalled()
    })
  })

  describe('Child Passport Expiration Validation', () => {
    it('should allow submission when child passport has at least one passport that expires within notice time', async () => {
      mockPassportsService.getCurrentPassport.mockResolvedValue({
        childPassports: [
          {
            childNationalId,
            passports: [
              {
                number: 'A1111111',
                expiresWithinNoticeTime: false,
              },
              {
                number: 'A2222222',
                expiresWithinNoticeTime: true, // At least one expires within notice time
              },
            ],
          },
        ],
      })

      const result = await service.submitPassportApplication({
        application: applicationForChild,
        auth: mockAuth,
        currentUserLocale: 'is' as Locale,
      })

      expect(result.success).toBe(true)
      expect(
        mockPassportsService.preregisterChildIdentityDocument,
      ).toHaveBeenCalled()
    })

    it('should allow submission when child passport is not found', async () => {
      mockPassportsService.getCurrentPassport.mockResolvedValue({
        childPassports: [
          {
            childNationalId: 'different-id',
            passports: [
              {
                number: 'A1111111',
                expiresWithinNoticeTime: false,
              },
            ],
          },
        ],
      })

      const result = await service.submitPassportApplication({
        application: applicationForChild,
        auth: mockAuth,
        currentUserLocale: 'is' as Locale,
      })

      expect(result.success).toBe(true)
      expect(
        mockPassportsService.preregisterChildIdentityDocument,
      ).toHaveBeenCalled()
    })

    it('should allow submission when child passport has no passports array', async () => {
      mockPassportsService.getCurrentPassport.mockResolvedValue({
        childPassports: [
          {
            childNationalId,
            passports: undefined,
          },
        ],
      })

      const result = await service.submitPassportApplication({
        application: applicationForChild,
        auth: mockAuth,
        currentUserLocale: 'is' as Locale,
      })

      expect(result.success).toBe(true)
      expect(
        mockPassportsService.preregisterChildIdentityDocument,
      ).toHaveBeenCalled()
    })

    it('should allow submission when child passport has empty passports array', async () => {
      mockPassportsService.getCurrentPassport.mockResolvedValue({
        childPassports: [
          {
            childNationalId,
            passports: [],
          },
        ],
      })

      const result = await service.submitPassportApplication({
        application: applicationForChild,
        auth: mockAuth,
        currentUserLocale: 'is' as Locale,
      })

      expect(result.success).toBe(true)
      expect(
        mockPassportsService.preregisterChildIdentityDocument,
      ).toHaveBeenCalled()
    })

    it('should throw TemplateApiError when child has passports but none expire within notice time', async () => {
      mockPassportsService.getCurrentPassport.mockResolvedValue({
        childPassports: [
          {
            childNationalId,
            passports: [
              {
                number: 'A1111111',
                expiresWithinNoticeTime: false,
              },
              {
                number: 'A2222222',
                expiresWithinNoticeTime: false, // None expire within notice time
              },
            ],
          },
        ],
      })

      await expect(
        service.submitPassportApplication({
          application: applicationForChild,
          auth: mockAuth,
          currentUserLocale: 'is' as Locale,
        }),
      ).rejects.toThrow(TemplateApiError)

      expect(
        mockPassportsService.preregisterChildIdentityDocument,
      ).not.toHaveBeenCalled()
    })

    it('should throw TemplateApiError when child has single passport that does not expire within notice time', async () => {
      mockPassportsService.getCurrentPassport.mockResolvedValue({
        childPassports: [
          {
            childNationalId,
            passports: [
              {
                number: 'A1111111',
                expiresWithinNoticeTime: false,
              },
            ],
          },
        ],
      })

      await expect(
        service.submitPassportApplication({
          application: applicationForChild,
          auth: mockAuth,
          currentUserLocale: 'is' as Locale,
        }),
      ).rejects.toThrow(TemplateApiError)

      expect(
        mockPassportsService.preregisterChildIdentityDocument,
      ).not.toHaveBeenCalled()
    })

    it('should handle edge case when expiresWithinNoticeTime is undefined', async () => {
      mockPassportsService.getCurrentPassport.mockResolvedValue({
        childPassports: [
          {
            childNationalId,
            passports: [
              {
                number: 'A1111111',
                expiresWithinNoticeTime: undefined,
              },
            ],
          },
        ],
      })

      await expect(
        service.submitPassportApplication({
          application: applicationForChild,
          auth: mockAuth,
          currentUserLocale: 'is' as Locale,
        }),
      ).rejects.toThrow(TemplateApiError)

      expect(
        mockPassportsService.preregisterChildIdentityDocument,
      ).not.toHaveBeenCalled()
    })
  })
})
