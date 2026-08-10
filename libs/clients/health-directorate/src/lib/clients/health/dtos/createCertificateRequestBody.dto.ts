import { CreateCertificateRequestDto } from '../gen/fetch/types.gen'

/**
 * The generated type declares startDate/endDate as `Date`, but the upstream
 * API actually expects a date-only string (YYYY-MM-DD) on the wire.
 */
export type CreateCertificateRequestBody = Omit<
  CreateCertificateRequestDto,
  'startDate' | 'endDate'
> & {
  startDate: string
  endDate: string
}
