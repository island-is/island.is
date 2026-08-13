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
import { U2ErrorCode } from './constants'

const isU2ErrorCode = (code: unknown): code is U2ErrorCode =>
  typeof code === 'string' &&
  (Object.values(U2ErrorCode) as string[]).includes(code)

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
    } catch (e) {
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
      const title =
        (currentUserLocale === 'is'
          ? result.reasonTitle
          : result.reasonTitleEN) || errorMessages.eligibilityErrorTitle

      const reasonText =
        (currentUserLocale === 'is' ? result.reason : result.reasonEN) || ''

      // TODO Remove so exeption is always shown
      const shouldAddException = isU2ErrorCode(result.code)

      const summary = shouldAddException
        ? {
            ...errorMessages.errorWithException,
            values: { value: reasonText },
          }
        : reasonText || errorMessages.cannotApplyErrorSummary

      throw new TemplateApiError(
        {
          title,
          summary,
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
