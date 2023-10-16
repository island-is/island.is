import { Test, TestingModule } from '@nestjs/testing'
import { OldAgePensionService } from './old-age-pension.service'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { createApplication } from '@island.is/application/testing'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import {
  HelloOddurApi,
  SocialInsuranceAdministrationClientService,
} from '@island.is/clients/social-insurance-administration'

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
          })),
        },
        {
          provide: HelloOddurApi,
          useClass: jest.fn(() => ({
            applicationGetApplicationInformation: () => Promise.reject(),
          })),
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
})
