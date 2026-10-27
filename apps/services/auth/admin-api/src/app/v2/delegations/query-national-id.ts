import { BadRequestException } from '@nestjs/common'
import * as kennitala from 'kennitala'
import { validate as isUuid } from 'uuid'

/**
 * Validates the `X-Query-National-Id` header. Headers can be missing or sent
 * more than once, so anything but a single valid national id is rejected.
 */
export const parseQueryNationalId = (value: unknown): string => {
  if (typeof value !== 'string' || !kennitala.isValid(value)) {
    throw new BadRequestException(
      'X-Query-National-Id must be a valid national id',
    )
  }

  return kennitala.sanitize(value)
}

/**
 * Ids of delegations from the delegation table. Delegation index records have
 * ids made from the national ids of both parties, which must not be audited.
 */
export const auditableDelegationIds = (
  delegations: { id?: string | null }[],
): string[] => delegations.flatMap((d) => (d.id && isUuid(d.id) ? [d.id] : []))
