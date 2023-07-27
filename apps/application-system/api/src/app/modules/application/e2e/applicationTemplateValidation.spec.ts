import type { User } from '@island.is/auth-nest-tools'
import { ApplicationValidationService } from '../tools/applicationTemplateValidation.service'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { Test } from '@nestjs/testing'
import * as faker from 'faker'
import { LoggingModule } from '@island.is/logging'
import { environment } from '../../../../environments'

describe('ApplicationTemplateValidation', () => {
  let applicationValidationService: ApplicationValidationService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [LoggingModule],
      providers: [
        ApplicationValidationService,
        {
          provide: FeatureFlagService,
          useClass: jest.fn(() => ({
            getValue(
              feature: Features,
              defaultValue: boolean | string,
              user?: User,
            ) {
              if (feature === Features.exampleApplication) {
                return true
              }
              if (feature === Features.accidentNotification) {
                if (user?.nationalId === '1234567890') {
                  return true
                }
                return false
              }
              return defaultValue
            },
          })),
        },
      ],
    }).compile()

    applicationValidationService = moduleRef.get<ApplicationValidationService>(
      ApplicationValidationService,
    )
  })

  it('Should not be ready when the supplied featureFlag is disabled', async () => {
    const mockUser = {
      nationalId: '1234567891',
      scope: [],
      authorization: faker.random.word(),
      client: faker.random.word(),
    }
    const results = await applicationValidationService.isTemplateReady(
      {
        readyForProduction: true,
        featureFlag: Features.accidentNotification,
      },
      mockUser,
    )
    expect(results).toBe(false)
  })

  it('Should be ready when when the supplied featureFlag is enabled and the readyForProd is false', async () => {
    const mockUser = {
      nationalId: '1234567891',
      scope: [],
      authorization: faker.random.word(),
      client: faker.random.word(),
    }

    const results = await applicationValidationService.isTemplateReady(
      {
        readyForProduction: false,
        featureFlag: Features.exampleApplication,
      },
      mockUser,
    )
    expect(results).toBe(true)
  })

  it('Should be ready when the supplied featureFlag is disabled and readyForProd is false and the users nationalId is whitelisted', async () => {
    const mockUser = {
      nationalId: '1234567890',
      scope: [],
      authorization: faker.random.word(),
      client: faker.random.word(),
    }

    const results = await applicationValidationService.isTemplateReady(
      {
        readyForProduction: false,
        featureFlag: Features.accidentNotification,
      },
      mockUser,
    )
    expect(results).toBe(true)
  })

  it('Should be ready when no featureFlag is supplied but readyForProduction is true on prod', async () => {
    const mockUser = {
      nationalId: '1234567890',
      scope: [],
      authorization: faker.random.word(),
      client: faker.random.word(),
    }

    const envBefore = environment.production
    environment.production = true
    const envNameBefore = environment.name
    environment.name = 'production'

    const results = await applicationValidationService.isTemplateReady(
      {
        readyForProduction: true,
      },
      mockUser,
    )
    expect(results).toBe(true)
    environment.production = envBefore
    environment.name = envNameBefore
  })

  it('Should not be ready when no featureFlag is supplied and readyForProduction is false on prod', async () => {
    const mockUser = {
      nationalId: '1234567890',
      scope: [],
      authorization: faker.random.word(),
      client: faker.random.word(),
    }

    const envBefore = environment.production
    environment.production = true
    const envNameBefore = environment.name
    environment.name = 'production'

    const results = await applicationValidationService.isTemplateReady(
      {
        readyForProduction: false,
      },
      mockUser,
    )
    expect(results).toBe(false)
    environment.production = envBefore
    environment.name = envNameBefore
  })

  it('Should be ready when no featureFlag is supplied and readyForProduction is undefined on prod', async () => {
    const mockUser = {
      nationalId: '1234567890',
      scope: [],
      authorization: faker.random.word(),
      client: faker.random.word(),
    }

    const envBefore = environment.production
    environment.production = true
    const envNameBefore = environment.name
    environment.name = 'production'

    const results = await applicationValidationService.isTemplateReady(
      {},
      mockUser,
    )
    expect(results).toBe(true)
    environment.production = envBefore
    environment.name = envNameBefore
  })

  it('Should be ready when not running on production without a featureFlag and regardless of readyForProduction flag on localhost', async () => {
    const mockUser = {
      nationalId: '1234567890',
      scope: [],
      authorization: faker.random.word(),
      client: faker.random.word(),
    }

    const results = await applicationValidationService.isTemplateReady(
      {
        readyForProduction: false,
      },
      mockUser,
    )
    expect(results).toBe(true)
  })
})
