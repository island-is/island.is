import { Inject, Injectable } from '@nestjs/common'
import { Application, ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../..'
import { Fasteign, FasteignirApi } from '@island.is/clients/assets'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { mockGetProperties } from './mockedFasteign'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { coreErrorMessages } from '@island.is/application/core'

import { ApplicationApi } from '@island.is/clients/hms-application-system'
import { TemplateApiError } from '@island.is/nest/problem'
import { getRecipients, getRequestDto } from './utils'
import { SharedTemplateApiService } from '../../../shared'
import {
  generateApplicationSubmittedEmail,
  generateApplicationSubmittedEmailWithDelegation,
} from './emailGenerators'

@Injectable()
export class RegistrationOfNewPropertyNumbersService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
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
        throw e
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
    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      application.id,
    )

    if (!isPayment?.fulfilled) {
      this.logger.error(
        'Attempting to submit registration for new property number that has not been paid.',
      )
      throw new Error(
        'Ekki er hægt að skila inn umsókn af því að ekki hefur tekist að taka við greiðslu.',
      )
    }

    const requestDto = getRequestDto(application)
    try {
      const response =
        await this.hmsApplicationSystemService.apiApplicationPost({
          applicationDto: requestDto,
        })

      if (response.status !== 200) {
        this.logger.error(
          '[RegistrationOfNewPropertyNumbersService]: Failed to submit application to HMS: ' +
            `status code ${response.status}`,
          response.message,
        )
        throw new Error(
          `[RegistrationOfNewPropertyNumbersService]: HMS API responded with status code ${response.status}`,
        )
      }

      await this.sendEmailAboutSubmitApplication(application)
    } catch (e) {
      this.logger.error(
        '[RegistrationOfNewPropertyNumbersService] Failed to submit application to HMS:',
        e.message,
      )
      throw e
    }
  }

  private async sendEmailAboutSubmitApplication(application: Application) {
    const recipientList = getRecipients(application)

    await Promise.all(
      recipientList.map((recipient) =>
        this.sharedTemplateAPIService
          .sendEmail((props) => {
            // Check if delegation or not
            if (
              props.application.applicantActors &&
              props.application.applicantActors.length > 0
            )
              return generateApplicationSubmittedEmailWithDelegation(
                props,
                recipient,
              )
            else return generateApplicationSubmittedEmail(props, recipient)
          }, application)
          .catch((e) => {
            this.logger.error(
              `[Registration of new property numbers]: Error sending email in submitApplication for applicationID: ${application.id}`,
              e,
            )
          }),
      ),
    )
  }
}
