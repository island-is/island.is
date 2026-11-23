import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import {
  DeliveryStatus,
  EmploymentEligibility,
  EmploymentHistoryPreview,
  SubmitApplicationResult,
  employmentCertificateErrors as errors,
} from '@island.is/application/templates/fjs/employment-certificate'
import {
  EmploymentCertificateClientNotConfiguredError,
  EmploymentCertificateClientResultMissingError,
  EmploymentCertificateClientService,
  getEmploymentCertificateClientProblem,
  isPreviewChanged,
} from '@island.is/clients/fjs/employment-certificate'
import type { EmploymentCertificateDeliveryStatus } from '@island.is/clients/fjs/employment-certificate'
import { AuditService } from '@island.is/nest/audit'
import { TemplateApiError } from '@island.is/nest/problem'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import { getCertificateRequest } from './utils/request'

type Operation = 'eligibility' | 'preview' | 'submit'

const unavailable = {
  title: errors.unavailableTitle,
  summary: errors.unavailableSummary,
}
const submitFailed = {
  title: errors.submitFailedTitle,
  summary: errors.submitFailedSummary,
}

const deliveryStatuses: Record<
  EmploymentCertificateDeliveryStatus,
  DeliveryStatus
> = {
  sent_to_mailbox: DeliveryStatus.SENT_TO_MAILBOX,
  processing: DeliveryStatus.PROCESSING,
  closed: DeliveryStatus.CLOSED,
}

@Injectable()
export class EmploymentCertificateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly client: EmploymentCertificateClientService,
    private readonly auditService: AuditService,
  ) {
    super(ApplicationTypes.EMPLOYMENT_CERTIFICATE)
  }

  async getEmploymentEligibility({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<EmploymentEligibility> {
    const eligibility = await this.callApi('eligibility', application.id, () =>
      this.client.getEligibility(auth),
    )

    if (!eligibility.hasEmploymentHistory) {
      throw new TemplateApiError(
        { title: errors.noHistoryTitle, summary: errors.noHistorySummary },
        400,
      )
    }
    return eligibility
  }

  async getEmploymentHistoryPreview({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<EmploymentHistoryPreview> {
    return this.callApi('preview', application.id, () =>
      this.client.getPreview(auth),
    )
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<SubmitApplicationResult> {
    const request = getCertificateRequest(application.answers)
    if (!request) {
      throw new TemplateApiError(submitFailed, 400)
    }

    // One key per application: a retry gets the stored case back instead of
    // creating another one.
    const result = await this.callApi('submit', application.id, () =>
      this.client.submitRequest(auth, {
        ...request,
        idempotencyKey: application.id,
      }),
    )
    const { caseId, deliveryStatus } = result

    // Never the comment: it is free text and can contain personal data.
    this.auditService.audit({
      auth,
      action: 'requestEmploymentCertificate',
      resources: application.id,
      meta: { caseId, deliveryStatus },
    })
    this.logger.info('Employment certificate requested', {
      applicationId: application.id,
      caseId,
      deliveryStatus,
    })

    return {
      caseId,
      // The template treats any accepted request that isn't sent or closed as
      // processing.
      deliveryStatus:
        deliveryStatuses[deliveryStatus] ?? DeliveryStatus.PROCESSING,
      documentId: result.documentId,
    }
  }

  /**
   * Fails with 409 only when the history changed after the applicant saw it,
   * which the template acts on. Otherwise 502 when the API refused the call or
   * sent an unusable answer, and 503 when there was no answer (not
   * configured, network error or timeout).
   */
  private async callApi<T>(
    operation: Operation,
    applicationId: string,
    call: () => Promise<T>,
  ): Promise<T> {
    try {
      return await call()
    } catch (error) {
      const problem = await getEmploymentCertificateClientProblem(error)
      const isUnusableAnswer =
        error instanceof EmploymentCertificateClientResultMissingError
      // The client's own errors have fixed messages without user data.
      const isClientError =
        isUnusableAnswer ||
        error instanceof EmploymentCertificateClientNotConfiguredError
      const meta = {
        operation,
        applicationId,
        status: problem?.status,
        code: problem?.code,
        requestId: problem?.requestId,
        errorName: error instanceof Error ? error.name : undefined,
        errorMessage: isClientError ? error.message : undefined,
      }

      if (isPreviewChanged(problem)) {
        this.logger.info('Employment certificate history changed', meta)
        throw new TemplateApiError(
          {
            title: errors.previewChangedTitle,
            summary: errors.previewChangedSummary,
          },
          409,
        )
      }

      if (problem?.status === 409) {
        // The same idempotency key came with a different body. The answers
        // can't change between retries, so this shouldn't happen.
        this.logger.error('Employment certificate API call failed', meta)
      } else {
        this.logger.warn('Employment certificate API call failed', meta)
      }

      throw new TemplateApiError(
        operation === 'submit' ? submitFailed : unavailable,
        problem || isUnusableAnswer ? 502 : 503,
      )
    }
  }
}
