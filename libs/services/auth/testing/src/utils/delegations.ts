import { expect } from '@jest/globals'
import faker from 'faker'

import {
  ApiScope,
  ApiScopeDelegationType,
  Delegation,
  DelegationDTO,
  DelegationProviderModel,
  DelegationScope,
  DelegationTypeModel,
} from '@island.is/auth-api-lib'
import {
  AuthDelegationProvider,
  AuthDelegationType,
  getPersonalRepresentativeDelegationType,
} from '@island.is/shared/types'

import { CreateDelegation } from '../fixtures/delegation.fixture'

const compareById = (a: { id?: string | null }, b: { id?: string | null }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return a.id === b.id ? 0 : a.id! < b.id! ? -1 : 1
}

/**
 * Sorts the delegation by id parameter to use for consistent expecting
 * @param delegations
 */
const sortDelegations = (delegations: DelegationDTO[]) => {
  delegations.forEach((delegation) => delegation.scopes?.sort(compareById))
  delegations.sort(compareById)
}

/**
 * Helper to match complete object when the received object has gone over the "wire"
 * and was JSON stringified.
 * @param received The SUT object recevied
 * @param expected The expected object to be matched against the received object
 */
export const expectMatchingDelegations = (
  received: DelegationDTO | DelegationDTO[],
  expected: DelegationDTO | DelegationDTO[],
) => {
  if (Array.isArray(received)) {
    sortDelegations(received)
  }
  if (Array.isArray(expected)) {
    sortDelegations(expected)
  }

  expect(received).toMatchObject(JSON.parse(JSON.stringify(expected)))
}

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
            include: [
              {
                model: ApiScopeDelegationType,
                where: { delegationType: AuthDelegationType.Custom },
              },
            ],
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

export async function findExpectedDelegationModelsOld(
  model: typeof Delegation,
  modelIds: string,
  allowedScopes?: string[],
): Promise<DelegationDTO>
export async function findExpectedDelegationModelsOld(
  model: typeof Delegation,
  modelIds: string[],
  allowedScopes?: string[],
): Promise<DelegationDTO[]>
export async function findExpectedDelegationModelsOld(
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

export const addDelegationTypesAndProvider = async (
  listOfRightTypes: { code: string; description: string }[],
  delegationProviderModel: typeof DelegationProviderModel,
  delegationTypeModel: typeof DelegationTypeModel,
) => {
  // Create delegation provider
  const [prov] = await delegationProviderModel.findOrCreate({
    where: {
      id: AuthDelegationProvider.PersonalRepresentativeRegistry,
    },
    defaults: {
      id: AuthDelegationProvider.PersonalRepresentativeRegistry,
      name: AuthDelegationProvider.PersonalRepresentativeRegistry,
      description: 'Provider for personal representatives',
    },
  })

  // Create delegation type
  await Promise.all(
    listOfRightTypes.map((rt) =>
      delegationTypeModel.create({
        description: rt.description,
        id: getPersonalRepresentativeDelegationType(rt.code),
        name: getPersonalRepresentativeDelegationType(` ${rt.code}`),
        providerId: prov.id,
      }),
    ),
  )
}
