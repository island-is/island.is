import { CreateCertificateRequestDto } from '../gen/fetch/types.gen'

/**
 * The generated type declares startDate/endDate as `Date` because this
 * client's openapi-ts config sets `dates: true` for every date field, but
 * that option only hydrates dates on responses — the wire format for this
 * request is actually a date-only string (YYYY-MM-DD), enforced upstream by
 * HealthDirectorateCreateCertificateRequestInput's validators.
 */
export type CreateCertificateRequestBody = Omit<
  CreateCertificateRequestDto,
  'startDate' | 'endDate'
> & {
  startDate: string
  endDate: string
}
