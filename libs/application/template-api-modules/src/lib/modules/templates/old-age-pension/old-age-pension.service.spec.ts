import { createApplication } from '@island.is/application/testing'
import { SocialInsuranceAdministrationClientService } from '@island.is/clients/social-insurance-administration'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { Test, TestingModule } from '@nestjs/testing'
import {
  APPLICATION_ATTACHMENT_BUCKET,
  OldAgePensionService,
} from './old-age-pension.service'

describe('OldAgePensionService', () => {
  let oldAgePensionService: OldAgePensionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OldAgePensionService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        {
          provide: SocialInsuranceAdministrationClientService,
          useClass: jest.fn(() => ({
            getOddur: () => 'OK FROM Oddur',
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

    oldAgePensionService =
      module.get<OldAgePensionService>(OldAgePensionService)
  })

  it('should be hello Oddur', () => {
    expect(oldAgePensionService).toBeDefined()

    const user = createCurrentUser()
    const application = createApplication({})

    return expect(
      oldAgePensionService.helloWorld({
        application: application,
        auth: user,
        currentUserLocale: 'is',
      }),
    ).resolves.toBe('OK FROM Oddur')
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
    jest.spyOn(oldAgePensionService, 'getPdf').mockImplementation(jest.fn())

    const result = await oldAgePensionService.sendApplication({
      application,
      auth,
      currentUserLocale: 'is',
    })

    expect(result).toMatchObject({ applicationLineId: '123' })
  })
})
