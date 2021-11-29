import * as faker from 'faker'
import addDays from 'date-fns/addDays'
import startOfDay from 'date-fns/startOfDay'

import { Delegation, DelegationScope } from '@island.is/auth-api-lib'

export type CreateDelegationScope = Pick<
  DelegationScope,
  | 'id'
  | 'validFrom'
  | 'validTo'
  | 'scopeName'
  | 'identityResourceName'
  | 'delegationId'
>

export type CreateDelegation = Pick<
  Delegation,
  'id' | 'fromNationalId' | 'fromDisplayName' | 'toNationalId' | 'toName'
> & { delegationScopes: CreateDelegationScope[] }

const createRandomNationalId = (): string => {
  return faker.datatype
    .number({
      min: 10000000000,
      max: 9999999999,
    })
    .toString()
}

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
    fromNationalId: createRandomNationalId(),
    fromDisplayName: faker.random.word(),
    toNationalId: createRandomNationalId(),
    toName: faker.random.word(),
    delegationScopes: [createRandomDelegationScope(id)],
  }
}

/**
 * Creates a DelegationScope fixture to be used with Delegation for testing.
 * @param delegationId Id of the delegation that the scope belongs to.
 * @param scopeName Name of the scope.
 * @param today A date the fixture uses as the current day to set valid or expired scopes.
 *              The test suite should use useFakeTimers and provide this value for consistent testing.
 *              Defaults to current datetime, but note that it could lead to undesired test results.
 * @param expired Flag to indicate if the delgation should be expired. Defaults to false.
 * @returns
 */
export const createDelegationScope = (
  delegationId: string,
  scopeName: string,
  today: Date,
  expired: boolean,
): CreateDelegationScope => {
  const fallback = createRandomDelegationScope(delegationId)

  return {
    ...fallback,
    scopeName,
    validFrom: startOfDay(expired ? addDays(today, -2) : today),
    validTo: startOfDay(addDays(today, expired ? -1 : 1)),
  }
}

/**
 * Creates a Delegation fixture to be used for testing.
 * @param fromNationalId NationalId of the user granting the delegation
 * @param toNationalId NationalId of the user receiving the delegation
 * @param scopes Scopes the delegation grants access to
 * @param today A date the fixture uses as the current day to set valid or expired scopes.
 *              The test suite should use useFakeTimers and provide this value for consistent testing.
 *              Defaults to current datetime, but note that it could lead to undesired test results.
 * @param expired Flag to indicate if the delgation should be expired. Defaults to false.
 * @returns
 */
export const createDelegation = (
  fromNationalId: string,
  toNationalId: string,
  scopes: string[],
  today: Date = new Date(),
  expired = false,
): CreateDelegation => {
  const delegation = createRandomDelegation()
  return {
    ...delegation,
    fromNationalId,
    toNationalId,
    delegationScopes: scopes.map((scope) =>
      createDelegationScope(delegation.id, scope, today, expired),
    ),
  }
}
