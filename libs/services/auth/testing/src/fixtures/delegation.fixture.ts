import * as faker from 'faker'
import addDays from 'date-fns/addDays'
import startOfDay from 'date-fns/startOfDay'

import { createNationalId } from '@island.is/testing/fixtures'
import {
  DelegationScope,
  DEFAULT_DOMAIN,
  Delegation,
} from '@island.is/auth-api-lib'

export interface CreateDelegationOptions {
  fromNationalId: string
  toNationalId: string
  scopes: string[]
  today?: Date
  expired?: boolean
  future?: boolean
  domainName?: string | null
}

export type CreateDelegationScope = Pick<
  DelegationScope,
  'id' | 'validFrom' | 'validTo' | 'scopeName' | 'delegationId'
>

export type CreateDelegation = Pick<
  Delegation,
  | 'id'
  | 'fromNationalId'
  | 'fromDisplayName'
  | 'toNationalId'
  | 'toName'
  | 'domainName'
> & { delegationScopes: CreateDelegationScope[] }

/**
 * Private helper to create a DelegationScope with random values.
 * @param delegationId Id of the delegation the scopes belongs to.
 * @returns
 */
const createRandomDelegationScope = (
  delegationId: string,
): CreateDelegationScope => {
  return {
    id: faker.datatype.uuid(),
    validFrom: faker.datatype.datetime(),
    validTo: faker.datatype.datetime(),
    scopeName: faker.random.word(),
    delegationId,
  }
}

/**
 * Private helper to create a Delegation with random values.
 * @returns
 */
const createRandomDelegation = (): CreateDelegation => {
  const id = faker.datatype.uuid()

  return {
    id,
    fromNationalId: createNationalId(),
    fromDisplayName: faker.random.word(),
    toNationalId: createNationalId(),
    toName: faker.random.word(),
    delegationScopes: [createRandomDelegationScope(id)],
    domainName: faker.random.word(),
  }
}

/**
 * Creates a DelegationScope fixture to be used with Delegation for testing.
 * @param delegationId Id of the delegation that the scope belongs to.
 * @param scopeName Name of the scope.
 * @param today A date the fixture uses as the current day to set valid or expired scopes.
 * @param expired Flag to indicate if the delgation should be expired. Defaults to false.
 * @returns
 */
export const createDelegationScope = (
  delegationId: string,
  scopeName: string,
  today: Date,
  expired: boolean,
  future: boolean,
): CreateDelegationScope => {
  const fallback = createRandomDelegationScope(delegationId)

  return {
    ...fallback,
    scopeName,
    validFrom: startOfDay(addDays(today, expired ? -2 : future ? 1 : 0)),
    validTo: startOfDay(addDays(today, expired ? -1 : future ? 2 : 1)),
  }
}

/**
 * Creates a Delegation fixture to be used for testing.
 * @param fromNationalId NationalId of the user granting the delegation
 * @param toNationalId NationalId of the user receiving the delegation
 * @param scopes Scopes the delegation grants access to
 * @param today A date the fixture uses as the current day to set valid or expired scopes.
 * @param expired Flag to indicate if the delgation should be expired. Defaults to false.
 * @returns
 */
export const createDelegation = ({
  fromNationalId,
  toNationalId,
  scopes,
  today = new Date(),
  expired = false,
  future = false,
  domainName = DEFAULT_DOMAIN,
}: CreateDelegationOptions): CreateDelegation => {
  const delegation = createRandomDelegation()
  return {
    ...delegation,
    fromNationalId,
    toNationalId,
    delegationScopes: scopes.map((scope) =>
      createDelegationScope(delegation.id, scope, today, expired, future),
    ),
    domainName: domainName ?? delegation.domainName,
  }
}
