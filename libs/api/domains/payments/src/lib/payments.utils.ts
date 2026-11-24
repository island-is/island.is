import { isIP } from 'net'

import type { GraphQLContext } from '@island.is/auth-nest-tools'
import type { VerifyCardResponse as PaymentsServiceVerifyCardResponse } from '@island.is/clients/payments'

import type { VerifyCardResponse } from './dto/verifyCard.response'

/** Gateway limit for the EMV 3-D Secure userAgent and acceptHeader members. */
const HEADER_MAX_LENGTH = 2048

/**
 * Connection information of the payer's own request, forwarded to the payments
 * service as part of the EMV 3-D Secure browser data.
 */
export interface PayerRequestInfo {
  ipAddress?: string
  userAgent?: string
  acceptHeader?: string
}

const firstHeaderValue = (
  value: string | string[] | undefined,
): string | undefined => (Array.isArray(value) ? value[0] : value)

/** Node reports IPv4 peers as IPv4-mapped IPv6 addresses (::ffff:1.2.3.4). */
const unmapIp = (value: string): string =>
  value.toLowerCase().startsWith('::ffff:') && isIP(value.slice(7)) === 4
    ? value.slice(7)
    : value

/**
 * Derives the payer's connection information from the incoming GraphQL
 * request for the EMV 3-D Secure browser data of a card verification.
 *
 * The client IP is the first x-forwarded-for hop — where our reverse proxies
 * record the connecting client (see the trust-proxy note in
 * infra-nest-server/bootstrap.ts) — falling back to the request/socket
 * address, matching how other API domains resolve the client IP. Candidates
 * that do not parse as an IP are skipped; when none qualifies the IP is
 * omitted rather than sending a malformed value to the gateway. Headers are
 * truncated to the gateway limit so an oversized header can never fail the
 * verification. All values are derived server-side, never trusted from
 * client-supplied GraphQL input.
 */
export const getPayerRequestInfo = (
  req: GraphQLContext['req'],
): PayerRequestInfo => {
  const forwardedIp = firstHeaderValue(req.headers['x-forwarded-for'])
    ?.split(',')[0]
    ?.trim()

  const ipAddress = [forwardedIp, req.ip, req.socket?.remoteAddress]
    .filter((candidate): candidate is string => !!candidate)
    .map(unmapIp)
    .find((candidate) => isIP(candidate) !== 0)

  return {
    ipAddress,
    userAgent: firstHeaderValue(req.headers['user-agent'])?.slice(
      0,
      HEADER_MAX_LENGTH,
    ),
    acceptHeader: firstHeaderValue(req.headers['accept'])?.slice(
      0,
      HEADER_MAX_LENGTH,
    ),
  }
}

/**
 * The payments service's card verification as the GraphQL type, whose fields
 * stay non-null though the payment gateway may leave out the ones the service
 * does not need. The payments app reads postUrl, verificationFields,
 * scriptPath, isSuccess and responseCode; the defaults only keep the schema's
 * contract for the rest.
 */
export const toVerifyCardResponse = (
  verification: PaymentsServiceVerifyCardResponse,
): VerifyCardResponse => ({
  ...verification,
  cardVerificationRawResponse: verification.cardVerificationRawResponse ?? '',
  additionalFields: verification.additionalFields ?? [],
  cardInformation: verification.cardInformation ?? {
    cardScheme: '',
    cardUsage: '',
  },
  responseCode: verification.responseCode ?? '',
  responseTime: verification.responseTime ?? '',
})
