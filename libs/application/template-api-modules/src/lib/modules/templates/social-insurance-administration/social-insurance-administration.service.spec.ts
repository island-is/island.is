import { createApplication } from '@island.is/application/testing'
import {
  SocialInsuranceAdministrationClientService,
  SocialInsuranceAdministrationGeneralApplicationService,
  SocialInsuranceAdministrationMedicalAndRehabilitationService,
  SocialInsuranceAdministrationOldAgePensionService,
} from '@island.is/clients/social-insurance-administration'
import { Test, TestingModule } from '@nestjs/testing'
import { SocialInsuranceAdministrationService } from './social-insurance-administration.service'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { ApplicationTypes } from '@island.is/application/types'
import { sharedModuleConfig } from '../../shared'
import { S3Service } from '@island.is/nest/aws'
import { NationalRegistryV3ApplicationsClientService } from '@island.is/clients/national-registry-v3-applications'
import { TemplateApiError } from '@island.is/nest/problem'
import { withApplicationGuidContext } from '@island.is/clients/social-insurance-administration'

jest.mock('@island.is/clients/social-insurance-administration', () => {
  const actual = jest.requireActual(
    '@island.is/clients/social-insurance-administration',
  )
  return {
    ...actual,
    withApplicationGuidContext: jest.fn(actual.withApplicationGuidContext),
  }
})

const mockConfig = {
  SharedModuleConfig: {
    templateApi: {
      attachmentBucket: 'island-is-dev-storage-application-system',
    },
  },
}

describe('SocialInsuranceAdministrationService', () => {
  let socialInsuranceAdministrationService: SocialInsuranceAdministrationService
  const sendMedicalAndRehabilitationPaymentsApplication = jest.fn()
  const sendApplication = jest.fn()
  const sendApplicationV2 = jest.fn()
  const getCurrencies = jest.fn()

  beforeEach(async () => {
    sendMedicalAndRehabilitationPaymentsApplication
      .mockReset()
      .mockResolvedValue({ applicationLineId: '0' })
    sendApplication.mockReset().mockResolvedValue({ applicationLineId: '123' })
    sendApplicationV2.mockReset().mockResolvedValue(undefined)
    getCurrencies.mockReset().mockResolvedValue(['ISK'])
    ;(withApplicationGuidContext as jest.Mock).mockClear()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialInsuranceAdministrationService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        {
          provide: sharedModuleConfig.KEY,
          useValue: mockConfig,
        },
        {
          provide: NationalRegistryV3ApplicationsClientService,
          useValue: {},
        },
        {
          provide: S3Service,
          useValue: {},
        },
        {
          provide: SocialInsuranceAdministrationClientService,
          useValue: {
            sendApplication,
            getCurrencies,
          },
        },
        {
          provide: SocialInsuranceAdministrationGeneralApplicationService,
          useValue: {
            sendApplicationV2,
          },
        },
        {
          provide: SocialInsuranceAdministrationOldAgePensionService,
          useClass: jest.fn(() => ({
            sendOldAgePensionApplication: () =>
              Promise.resolve({
                applicationLineId: '0',
              }),
          })),
        },
        {
          provide: SocialInsuranceAdministrationMedicalAndRehabilitationService,
          useValue: {
            sendMedicalAndRehabilitationPaymentsApplication,
          },
        },
      ],
    }).compile()

    socialInsuranceAdministrationService =
      module.get<SocialInsuranceAdministrationService>(
        SocialInsuranceAdministrationService,
      )
  })

  it('should send old age pension application', async () => {
    const auth = createCurrentUser()
    const application = createApplication({
      externalData: {
        socialInsuranceAdministrationApplicant: {
          data: {
            bankAccount: {
              bank: '2222',
              ledger: '00',
              accountNumber: '123456',
            },
          },
          date: new Date('2021-06-10T11:31:02.641Z'),
          status: 'success',
        },
      },
      answers: {
        paymentInfo: {
          bank: { ledger: '00', bankNumber: '2222', accountNumber: '123456' },
          iban: '',
          swift: '',
          taxLevel: '2',
          bankAccountType: 'icelandic',
          personalAllowance: 'no',
        },
        'period.year': '2023',
        'fileUploadAdditionalFiles.additionalDocuments': [
          { key: 'key', name: 'name' },
        ],
      },
      typeId: ApplicationTypes.OLD_AGE_PENSION,
    })

    // Also need to mock the pdf here
    jest
      .spyOn(socialInsuranceAdministrationService, 'getPdf')
      .mockImplementation(jest.fn())

    const result = await socialInsuranceAdministrationService.sendApplication({
      application,
      auth,
      currentUserLocale: 'is',
    })

    expect(result).toMatchObject({ applicationLineId: '0' })
  })

  it('should send household supplement application', async () => {
    const auth = createCurrentUser()
    const application = createApplication({
      externalData: {
        socialInsuranceAdministrationApplicant: {
          data: {
            bankAccount: {
              bank: '2222',
              ledger: '00',
              accountNumber: '123456',
            },
          },
          date: new Date('2021-06-10T11:31:02.641Z'),
          status: 'success',
        },
      },
      answers: {
        paymentInfo: {
          bank: '222200123456',
          taxLevel: '2',
          personalAllowance: 'no',
        },
        'period.year': '2023',
      },
      typeId: ApplicationTypes.HOUSEHOLD_SUPPLEMENT,
    })

    // Also need to mock the pdf here
    jest
      .spyOn(socialInsuranceAdministrationService, 'getPdf')
      .mockImplementation(jest.fn())

    await socialInsuranceAdministrationService.sendApplication({
      application,
      auth,
      currentUserLocale: 'is',
    })

    expect(sendApplicationV2).toHaveBeenCalledWith(
      auth,
      expect.objectContaining({ applicationId: application.id }),
      'householdsupplement',
    )
    expect(sendApplication).not.toHaveBeenCalled()
  })

  it('should send additional support for the elderly application', async () => {
    const auth = createCurrentUser()
    const application = createApplication({
      answers: {
        paymentInfo: {
          bank: '222200123456',
          taxLevel: '2',
          personalAllowance: 'no',
        },
        period: { year: '2026', month: 'January' },
      },
      typeId: ApplicationTypes.ADDITIONAL_SUPPORT_FOR_THE_ELDERLY,
    })

    await socialInsuranceAdministrationService.sendApplication({
      application,
      auth,
      currentUserLocale: 'is',
    })

    expect(sendApplicationV2).toHaveBeenCalledWith(
      auth,
      expect.objectContaining({ applicationId: application.id }),
      'additionalsupportfortheelderly',
    )
    expect(sendApplication).not.toHaveBeenCalled()
  })

  it('should stop an incomplete medical and rehabilitation payments application from being sent', async () => {
    const auth = createCurrentUser()
    // The answers an application holds right after the prerequisites step,
    // matching the empty applications Tryggingastofnun received.
    const application = createApplication({
      answers: {
        approveExternalData: true,
        incomePlanTable: [
          {
            income: 'yearly',
            currency: 'IKR',
            incomeType: 'Laun',
            incomePerYear: '0',
            incomeCategory: 'Atvinnutekjur',
          },
        ],
      },
      typeId: ApplicationTypes.MEDICAL_AND_REHABILITATION_PAYMENTS,
    })

    await expect(
      socialInsuranceAdministrationService.sendApplication({
        application,
        auth,
        currentUserLocale: 'is',
      }),
    ).rejects.toBeInstanceOf(TemplateApiError)

    expect(
      sendMedicalAndRehabilitationPaymentsApplication,
    ).not.toHaveBeenCalled()
  })

  it('should send a complete medical and rehabilitation payments application', async () => {
    const auth = createCurrentUser()
    const application = createApplication({
      externalData: {
        socialInsuranceAdministrationApplicant: {
          data: {
            bankAccount: {
              bank: '2222',
              ledger: '00',
              accountNumber: '123456',
            },
          },
          date: new Date('2021-06-10T11:31:02.641Z'),
          status: 'success',
        },
      },
      answers: {
        applicantInfo: {
          email: 'mail@mail.is',
          phonenumber: '6611234',
        },
        paymentInfo: {
          bank: { bankNumber: '2222', ledger: '00', accountNumber: '123456' },
          personalAllowance: 'no',
          taxLevel: '2',
        },
        questions: {
          isPartTimeEmployed: 'no',
          isStudying: 'no',
        },
        selfAssessmentQuestionsOne: {
          educationalLevel: '1',
        },
      },
      typeId: ApplicationTypes.MEDICAL_AND_REHABILITATION_PAYMENTS,
    })

    const result = await socialInsuranceAdministrationService.sendApplication({
      application,
      auth,
      currentUserLocale: 'is',
    })

    expect(result).toMatchObject({ applicationLineId: '0' })
    expect(
      sendMedicalAndRehabilitationPaymentsApplication,
    ).toHaveBeenCalledTimes(1)
  })

  describe('application guid context', () => {
    const performGetCurrencies = (typeId: ApplicationTypes) => {
      const application = createApplication({ typeId })
      return {
        application,
        result: socialInsuranceAdministrationService.performAction(
          {
            templateId: typeId,
            actionId: 'test',
            action: 'getCurrencies',
            props: {
              application,
              auth: createCurrentUser(),
              currentUserLocale: 'is',
            },
          },
          jest.fn(),
        ),
      }
    }

    it('runs medical and rehabilitation payments actions in the application guid context', async () => {
      const { application, result } = performGetCurrencies(
        ApplicationTypes.MEDICAL_AND_REHABILITATION_PAYMENTS,
      )

      await expect(result).resolves.toEqual({
        success: true,
        response: ['ISK'],
      })
      expect(withApplicationGuidContext).toHaveBeenCalledWith(
        application.id,
        expect.any(Function),
      )
    })

    it('does not set the application guid context for other applications', async () => {
      const { result } = performGetCurrencies(ApplicationTypes.OLD_AGE_PENSION)

      await expect(result).resolves.toEqual({
        success: true,
        response: ['ISK'],
      })
      expect(withApplicationGuidContext).not.toHaveBeenCalled()
    })
  })
})
