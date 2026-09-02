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
import { FetchError } from '@island.is/clients/middlewares'

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

  private throwDefaultError(): never {
    throw new TemplateApiError(
      {
        title: coreErrorMessages.defaultTemplateApiError,
        summary: errorMessages.dataFetchErrorSummary,
      },
      500,
    )
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
      this.throwDefaultError()
    }

    if (!result.isEligible) {
      const title =
        (currentUserLocale === 'is'
          ? result.reasonTitle
          : result.reasonTitleEN) || errorMessages.eligibilityErrorTitle

      const reasonText =
        (currentUserLocale === 'is' ? result.reason : result.reasonEN) || ''

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
      this.logger.warn(
        '[VMST-U2-Certificate] - Error fetching EES countries',
        e,
      )
      this.throwDefaultError()
    }
  }

  async completeApplication({
    auth,
    application,
    currentUserLocale,
  }: TemplateApiModuleActionProps): Promise<boolean> {
    const countryId =
      getValueViaPath<string>(application.answers, 'countryAndDate.country') ||
      ''
    const dateString = getValueViaPath<string>(
      application.answers,
      'countryAndDate.departureDate',
    )
    const date = dateString ? new Date(dateString) : undefined
    if (!date) {
      this.throwDefaultError()
    }

    try {
      await this.vmstUnemploymentClientService.submitU2Application(
        auth,
        countryId,
        date,
        application.id,
      )
    } catch (e) {
      const body =
        e instanceof FetchError
          ? (e.body as { reason?: string; reasonEn?: string })
          : undefined
      const erroMessage =
        currentUserLocale === 'is' ? body?.reason : body?.reasonEn
      this.logger.warn('[VMST-U2-Certificate] - Submit failed', e)
      throw new TemplateApiError(
        {
          title: errorMessages.eligibilityErrorTitle,
          summary: erroMessage || errorMessages.cannotApplyErrorSummary,
        },
        500,
      )
    }
    return true
  }

  async revokeApplication({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<void> {
    // Defense-in-depth: REVOKE is only wired to the applicant role in the template.
    if (auth.nationalId !== application.applicant) {
      this.logger.warn(
        '[VMST-U2-Certificate] - Revoke invoked by non-applicant, skipping',
      )
      this.throwDefaultError()
    }

    let response
    try {
      response = await this.vmstUnemploymentClientService.revokeU2Application(
        auth,
      )
    } catch (e) {
      this.logger.error('[VMST-U2-Certificate] - Error revoking application', e)
      this.throwDefaultError()
    }

    if (!response.success) {
      this.logger.warn(
        '[VMST-U2-Certificate] - Error revoking application',
        response.errorMessage,
      )
      this.throwDefaultError()
    }
  }
}
