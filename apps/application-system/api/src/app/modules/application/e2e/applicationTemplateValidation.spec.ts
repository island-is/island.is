import type { User } from '@island.is/auth-nest-tools'
import { ApplicationValidationService } from '../tools/applicationTemplateValidation.service'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { Test } from '@nestjs/testing'
import * as faker from 'faker'
import { ApplicationFeatures } from '@island.is/application/core'
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
              feature: ApplicationFeatures,
              defaultValue: boolean | string,
              user?: User,
            ) {
              if (feature === ApplicationFeatures.exampleApplication) {
                return true
              }
              if (feature === ApplicationFeatures.accidentNotification) {
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

  it('Should not be ready when the supplied featureFlag is disabled and the readyForProd is false on prod', async () => {
    const mockUser = {
      nationalId: '1234567891',
      scope: [],
      authorization: faker.random.word(),
      client: faker.random.word(),
    }

    const envBefore = environment.production
    environment.production = true
    const envNameBefore = environment.name
    environment.name = 'production'
    const results = await applicationValidationService.isTemplateReady(
      mockUser,
      {
        readyForProduction: false,
        featureFlag: ApplicationFeatures.accidentNotification,
      },
    )

    expect(results).toBe(false)
    environment.production = envBefore
    environment.name = envNameBefore
  })

  it('Should be ready when when the supplied featureFlag is enabled and the readyForProd is false on prod', async () => {
    const mockUser = {
      nationalId: '1234567891',
      scope: [],
      authorization: faker.random.word(),
      client: faker.random.word(),
    }

    const envBefore = environment.production
    environment.production = true
    const envNameBefore = environment.name
    environment.name = 'production'

    const results = await applicationValidationService.isTemplateReady(
      mockUser,
      {
        readyForProduction: false,
        featureFlag: ApplicationFeatures.exampleApplication,
      },
    )
    expect(results).toBe(true)
    environment.production = envBefore
    environment.name = envNameBefore
  })

  it('Should be ready when the supplied featureFlag is disabled and readyForProd is false and the users nationalId is whitelisted on prod', async () => {
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
      mockUser,
      {
        readyForProduction: false,
        featureFlag: ApplicationFeatures.accidentNotification,
      },
    )
    expect(results).toBe(true)
    environment.production = envBefore
    environment.name = envNameBefore
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
      mockUser,
      {
        readyForProduction: true,
      },
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
      mockUser,
      {
        readyForProduction: false,
      },
    )
    expect(results).toBe(false)
    environment.production = envBefore
    environment.name = envNameBefore
  })

  it('Should be ready regardless when not running on production', async () => {
    const mockUser = {
      nationalId: '1234567890',
      scope: [],
      authorization: faker.random.word(),
      client: faker.random.word(),
    }

    const results = await applicationValidationService.isTemplateReady(
      mockUser,
      {
        readyForProduction: false,
      },
    )
    expect(results).toBe(true)
  })
})
