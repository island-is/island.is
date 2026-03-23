import { createApplication } from '@island.is/application/testing'
import { SocialInsuranceAdministrationClientService } from '@island.is/clients/social-insurance-administration'
import { Test, TestingModule } from '@nestjs/testing'
import { SocialInsuranceAdministrationService } from './social-insurance-administration.service'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { ApplicationTypes } from '@island.is/application/types'
import { sharedModuleConfig } from '../../shared'
import { S3Service } from '@island.is/nest/aws'
import { NationalRegistryV3ApplicationsClientService } from '@island.is/clients/national-registry-v3-applications'

const mockConfig = {
  SharedModuleConfig: {
    templateApi: {
      attachmentBucket: 'island-is-dev-storage-application-system',
    },
  },
}

describe('SocialInsuranceAdministrationService', () => {
  let socialInsuranceAdministrationService: SocialInsuranceAdministrationService

  beforeEach(async () => {
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
          useClass: jest.fn(() => ({
            sendApplication: () =>
              Promise.resolve({
                applicationLineId: '123',
              }),
          })),
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
          bank: '222200123456',
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

    expect(result).toMatchObject({ applicationLineId: '123' })
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

    const result = await socialInsuranceAdministrationService.sendApplication({
      application,
      auth,
      currentUserLocale: 'is',
    })

    expect(result).toMatchObject({ applicationLineId: '123' })
  })
})
