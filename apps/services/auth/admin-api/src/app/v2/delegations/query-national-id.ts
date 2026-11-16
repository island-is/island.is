import { BadRequestException } from '@nestjs/common'
import * as kennitala from 'kennitala'
import { isUuid } from 'uuidv4'

export const parseQueryNationalId = (value: unknown): string => {
  if (typeof value !== 'string' || !kennitala.isValid(value)) {
    throw new BadRequestException(
      'X-Query-National-Id must be a valid national id',
    )
  }

  return kennitala.sanitize(value)
}

/** Delegation index ids contain the national ids of both parties. */
export const auditableDelegationIds = (
  delegations: { id?: string | null }[],
): string[] => delegations.flatMap((d) => (d.id && isUuid(d.id) ? [d.id] : []))
