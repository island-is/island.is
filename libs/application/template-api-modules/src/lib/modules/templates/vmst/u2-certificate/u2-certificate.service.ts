import { Inject } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { VmstUnemploymentClientService } from '@island.is/clients/vmst-unemployment'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'
import type { Logger } from '@island.is/logging'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'
import { errorMessages } from '@island.is/application/templates/vmst/u2-certificate'
import { FetchError } from '@island.is/clients/middlewares'

export class U2CertificateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
  ) {
    super(ApplicationTypes.U2_CERTIFICATE)
  }

  async getEligibility({
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps) {
    let result
    try {
      result = await this.vmstUnemploymentClientService.checkU2Eligibility(auth)
      console.log('RESULT', result)
    } catch (e) {
      const body =
        e instanceof FetchError
          ? (e.body as { message?: string; code?: string })
          : undefined
      const summary = body?.code
      console.log(summary)
      this.logger.error('[VMST-U2-Certificate] - Error checking eligibility', e)
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.failedDataProvider,
        },
        500,
      )
    }

    if (!result.isEligible) {
      throw new TemplateApiError(
        {
          title: errorMessages.eligibilityErrorTitle,
          summary:
            (currentUserLocale === 'is'
              ? (result.reason || '') + errorMessages.cannotApplyErrorSummary
              : result.reasonEN) || errorMessages.cannotApplyErrorSummary,
        },
        400,
      )
    }

    return result
  }

  async getEESCountries() {
    try {
      return await this.vmstUnemploymentClientService.getEESCountries()
    } catch (e) {
      this.logger.error(
        '[VMST-U2-Certificate] - Error fetching EES countries',
        e,
      )
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: errorMessages.dataFetchErrorSummary,
        },
        500,
      )
    }
  }

  async completeApplication({
    auth,
    application,
    currentUserLocale,
  }: TemplateApiModuleActionProps): Promise<boolean> {
    try {
      const countryId =
        getValueViaPath<string>(
          application.answers,
          'countryAndDate.country',
        ) || ''
      const dateString = getValueViaPath<string>(
        application.answers,
        'countryAndDate.departureDate',
      )
      const date = dateString ? new Date(dateString) : undefined
      if (!date) {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.defaultTemplateApiError,
            summary: errorMessages.dataFetchErrorSummary,
          },
          500,
        )
      }
      const response =
        await this.vmstUnemploymentClientService.submitU2Application(
          auth,
          countryId,
          date,
        )
      if (!response.success) {
        throw new TemplateApiError(
          {
            title: errorMessages.eligibilityErrorTitle,
            // TODO HAVE VMST RETURN ENGLISH OR ACCEPT LOCALE
            summary:
              (currentUserLocale === 'is'
                ? response.errorMessage
                : response.errorMessage) ||
              errorMessages.cannotApplyErrorSummary,
          },
          500,
        )
      }
      return true
    } catch (e) {
      return false
    }
  }
}
