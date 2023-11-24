import { createApplication } from '@island.is/application/testing'
import { SocialInsuranceAdministrationClientService } from '@island.is/clients/social-insurance-administration'
import { Test, TestingModule } from '@nestjs/testing'
import {
  APPLICATION_ATTACHMENT_BUCKET,
  SocialInsuranceAdministrationService,
} from './social-insurance-administration.service'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'

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
          provide: SocialInsuranceAdministrationClientService,
          useClass: jest.fn(() => ({
            sendApplication: () =>
              Promise.resolve({
                applicationLineId: '123',
              }),
          })),
        },
        {
          provide: APPLICATION_ATTACHMENT_BUCKET,
          useValue: 'attachmentBucket',
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
      answers: {
        'period.year': '2023',
        'fileUploadAdditionalFiles.additionalDocuments': [
          { key: 'key', name: 'name' },
        ],
      },
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
