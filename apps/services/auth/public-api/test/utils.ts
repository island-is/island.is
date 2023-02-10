import {
  Delegation,
  DelegationDTOMapper,
  MergedDelegationDTO,
} from '@island.is/auth-api-lib'
import { findExpectedDelegationModels } from '@island.is/services/auth/testing'

/**
 * Helper to match complete object when the received object has gone over the "wire"
 * and was JSON stringified.
 * @param received The SUT object received
 * @param expected The expected object to be matched against the received object
 */
export const expectMatchingMergedDelegations = (
  received: MergedDelegationDTO | MergedDelegationDTO[],
  expected: MergedDelegationDTO | MergedDelegationDTO[],
) => {
  if (Array.isArray(received)) {
    sortMergedDelegations(received)
  }
  if (Array.isArray(expected)) {
    sortMergedDelegations(expected)
  }

  expect(received).toMatchObject(JSON.parse(JSON.stringify(expected)))
}

/**
 * Sorts the merged delegation by fromNationalId parameter to use for consistent expecting
 * @param delegations
 */
const sortMergedDelegations = (delegations: MergedDelegationDTO[]) => {
  delegations.sort((a, b) => {
    return a.fromNationalId === b.fromNationalId
      ? 0
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      a.fromNationalId! < b.fromNationalId!
      ? -1
      : 1
  })
}

export async function findExpectedMergedDelegationModels(
  model: typeof Delegation,
  modelIds: string,
  allowedScopes?: string[],
): Promise<MergedDelegationDTO>
export async function findExpectedMergedDelegationModels(
  model: typeof Delegation,
  modelIds: string[],
  allowedScopes?: string[],
): Promise<MergedDelegationDTO[]>
export async function findExpectedMergedDelegationModels(
  model: typeof Delegation,
  modelIds: string | string[],
  allowedScopes?: string[],
): Promise<MergedDelegationDTO | MergedDelegationDTO[]> {
  const expectedModels = await findExpectedDelegationModels(
    model,
    Array.isArray(modelIds) ? modelIds : [modelIds],
    allowedScopes,
  )

  if (Array.isArray(modelIds)) {
    return expectedModels.map((delegation) =>
      DelegationDTOMapper.toMergedDelegationDTO(delegation),
    )
  } else {
    return DelegationDTOMapper.toMergedDelegationDTO(expectedModels[0])
  }
}
