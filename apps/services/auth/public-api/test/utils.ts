import faker from 'faker'

import {
  ApiScope,
  Delegation,
  DelegationDTO,
  DelegationScope,
} from '@island.is/auth-api-lib'
import { CreateDelegation } from '@island.is/services/auth/testing'

export type NameIdTuple = [name: string, id: string]

export const getFakeName = () =>
  faker.fake('{{name.firstName}} {{name.lastName}}')

export async function createDelegationModels(
  model: typeof Delegation,
  creationModels: CreateDelegation[],
) {
  await model.bulkCreate(creationModels, {
    include: [
      {
        model: DelegationScope,
        as: 'delegationScopes',
      },
    ],
  })
}

export async function findExpectedDelegationModels(
  model: typeof Delegation,
  modelIds: string,
  allowedScopes?: string[],
): Promise<DelegationDTO>
export async function findExpectedDelegationModels(
  model: typeof Delegation,
  modelIds: string[],
  allowedScopes?: string[],
): Promise<DelegationDTO[]>
export async function findExpectedDelegationModels(
  model: typeof Delegation,
  modelIds: string | string[],
  allowedScopes?: string[],
): Promise<DelegationDTO | DelegationDTO[]> {
  const expectedModels = await model.findAll({
    where: {
      id: modelIds,
    },
    include: [
      {
        model: DelegationScope,
        as: 'delegationScopes',
        include: [
          {
            model: ApiScope,
            as: 'apiScope',
            where: {
              allowExplicitDelegationGrant: true,
            },
          },
        ],
      },
    ],
  })

  if (allowedScopes) {
    for (const expectedModel of expectedModels) {
      expectedModel.delegationScopes = expectedModel.delegationScopes?.filter(
        (s) => allowedScopes.includes(s.scopeName),
      )
    }
  }

  if (Array.isArray(modelIds)) {
    return expectedModels.map((delegation) => delegation.toDTO())
  } else {
    return expectedModels[0].toDTO()
  }
}
