import { Inject, Injectable } from '@nestjs/common'
import { withAuthContext } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import {
  getEmploymentHistoryEligibility,
  getEmploymentHistoryPreview,
  postEmploymentHistoryRequests,
} from '../../gen/fetch'
import type {
  HttpapiApplicantCertificateAcceptedResponse,
  HttpapiApplicantCertificateDeliveryResponse,
  ModelsApplicantPreview,
} from '../../gen/fetch'
import {
  EmploymentCertificateClientNotConfiguredError,
  EmploymentCertificateClientResultMissingError,
} from './employment-certificate.errors'
import { EMPLOYMENT_CERTIFICATE_CLIENT_OPTIONS } from './employment-certificate.options'
import type { EmploymentCertificateClientOptions } from './employment-certificate.options'
import type {
  EmploymentCertificateRequestResult,
  EmploymentEligibility,
  EmploymentHistoryPreview,
  SubmitRequestInput,
} from './employment-certificate.types'

type RequestResponse =
  | HttpapiApplicantCertificateDeliveryResponse
  | HttpapiApplicantCertificateAcceptedResponse

// The API's schema marks nothing in its answers as required.
const mapPreview = (
  preview: ModelsApplicantPreview | undefined,
): EmploymentHistoryPreview => {
  if (!preview?.previewVersion) {
    throw new EmploymentCertificateClientResultMissingError(
      'getPreview',
      'previewVersion',
    )
  }

  const institutions = (preview.institutions ?? []).map((institution) => {
    // Without an ID the institution can't be chosen for the certificate.
    if (!institution.id) {
      throw new EmploymentCertificateClientResultMissingError(
        'getPreview',
        'institutions[].id',
      )
    }
    return {
      id: institution.id,
      name: institution.name ?? '',
      from: institution.from ?? null,
      to: institution.to ?? null,
    }
  })

  return { previewVersion: preview.previewVersion, institutions }
}

const mapRequestResult = (
  result: RequestResponse | undefined,
  httpStatus: number,
): EmploymentCertificateRequestResult => {
  if (!result?.caseId) {
    throw new EmploymentCertificateClientResultMissingError(
      'submitRequest',
      'caseId',
    )
  }

  // A 201 always means the certificate was delivered to the mailbox.
  const deliveryStatus =
    result.deliveryStatus ??
    (httpStatus === 201 ? 'sent_to_mailbox' : undefined)
  if (!deliveryStatus) {
    throw new EmploymentCertificateClientResultMissingError(
      'submitRequest',
      'deliveryStatus',
    )
  }

  return {
    caseId: result.caseId,
    deliveryStatus,
    documentId: ('documentId' in result ? result.documentId : null) ?? null,
  }
}

/**
 * Client for Fjársýsla ríkisins' employment-certificate API. Every call is made
 * as the given user: the API reads the person from the token and takes no
 * national ID.
 */
@Injectable()
export class EmploymentCertificateClientService {
  constructor(
    @Inject(EMPLOYMENT_CERTIFICATE_CLIENT_OPTIONS)
    private readonly options: EmploymentCertificateClientOptions,
  ) {}

  async getEligibility(user: User): Promise<EmploymentEligibility> {
    const { data } = await this.asUser(user, () =>
      getEmploymentHistoryEligibility(),
    )
    if (typeof data?.hasEmploymentHistory !== 'boolean') {
      throw new EmploymentCertificateClientResultMissingError(
        'getEligibility',
        'hasEmploymentHistory',
      )
    }
    return { hasEmploymentHistory: data.hasEmploymentHistory }
  }

  async getPreview(user: User): Promise<EmploymentHistoryPreview> {
    const { data } = await this.asUser(user, () =>
      getEmploymentHistoryPreview(),
    )
    return mapPreview(data)
  }

  async submitRequest(
    user: User,
    input: SubmitRequestInput,
  ): Promise<EmploymentCertificateRequestResult> {
    // The API treats a blank comment as absent but rejects null.
    const comment = input.comment?.trim()

    const { data, response } = await this.asUser(user, () =>
      postEmploymentHistoryRequests({
        headers: { 'Idempotency-Key': input.idempotencyKey },
        body: {
          previewVersion: input.previewVersion,
          institutionIds: input.institutionIds,
          includeUnion: input.includeUnion,
          ...(comment ? { comment } : {}),
        },
      }),
    )
    return mapRequestResult(data, response.status)
  }

  private asUser<T>(user: User, call: () => Promise<T>): Promise<T> {
    if (this.options.notConfiguredReason) {
      return Promise.reject(
        new EmploymentCertificateClientNotConfiguredError(
          this.options.notConfiguredReason,
        ),
      )
    }
    return withAuthContext(user, call)
  }
}
