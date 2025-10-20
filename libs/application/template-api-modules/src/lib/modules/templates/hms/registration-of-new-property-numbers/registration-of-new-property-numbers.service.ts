import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../..'
import { Fasteign, FasteignirApi } from '@island.is/clients/assets'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { mockGetProperties } from './mockedFasteign'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'

import { ApplicationApi } from '@island.is/clients/hms-application-system'
import { TemplateApiError } from '@island.is/nest/problem'
import { getRequestDto } from './utils'

@Injectable()
export class RegistrationOfNewPropertyNumbersService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private propertiesApi: FasteignirApi,
    private hmsApplicationSystemService: ApplicationApi,
  ) {
    super(ApplicationTypes.REGISTRATION_OF_NEW_PROPERTY_NUMBERS)
  }
  private getRealEstatesWithAuth(auth: User) {
    return this.propertiesApi.withMiddleware(
      new AuthMiddleware(auth, { forwardUserInfo: true }),
    )
  }

  async getProperties({ auth }: TemplateApiModuleActionProps) {
    let properties: Array<Fasteign> = []

    // Mock for dev, since there is no dev service for the propertiesApi
    if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
      properties = mockGetProperties()
    }
    // Fetching a list of all property numbers for a users ssn and then fetching each property individually
    else {
      try {
        const api = this.getRealEstatesWithAuth(auth)
        const simpleProperties = await api.fasteignirGetFasteignir({
          kennitala: auth.nationalId,
        })

        properties = await Promise.all(
          simpleProperties?.fasteignir?.map((property) => {
            return api.fasteignirGetFasteign({
              fasteignanumer:
                // Property and land numbers are prefixed with F or L respectively in the fasteignir API
                // we need to remove that prefix when fetching individual properties
                property.fasteignanumer?.replace(/\D/g, '') ?? '',
            })
          }) ?? [],
        )
      } catch (e) {
        this.logger.error(
          '[RegistrationOfNewPropertyNumbersService] Failed to fetch properties:',
          e.message,
        )
        throw new TemplateApiError(e, 500)
      }
    }

    if (properties?.length === 0) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.noPropertiesFoundTitle,
          summary: coreErrorMessages.noPropertiesFoundSummary,
        },
        400,
      )
    }

    return properties
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    const requestDto = getRequestDto(application)

    try {
      const response =
        await this.hmsApplicationSystemService.apiApplicationPost({
          applicationDto: requestDto,
        })

      if (response.status !== 200) {
        this.logger.error(
          '[RegistrationOfNewPropertyNumbersService] Failed to submit application to HMS: ' +
            `status code ${response.status}`,
        )
        throw new TemplateApiError(
          {
            title: 'Failed to submit application',
            summary: `HMS API responded with status code ${response.status}`,
          },
          500,
        )
      }
    } catch (e) {
      this.logger.error(
        '[RegistrationOfNewPropertyNumbersService] Failed to submit application to HMS:',
        e.message,
      )
      throw new TemplateApiError(e, 500)
    }

    return Promise.resolve([])
  }
}
