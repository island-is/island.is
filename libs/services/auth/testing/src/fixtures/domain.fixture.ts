import faker from 'faker'
import { createNationalId } from '@island.is/testing/fixtures'
import { Domain } from '@island.is/auth-api-lib'
import { CreateApiScope } from './types'

export type CreateDomain = Pick<Domain, 'name'> &
  Partial<
    Pick<Domain, 'description' | 'nationalId' | 'organisationLogoKey'>
  > & {
    apiScopes?: CreateApiScope[]
  }

export const createDomain = ({
  name,
  description,
  nationalId,
}: Partial<CreateDomain> = {}): CreateDomain => {
  return {
    name: name ?? faker.random.word(),
    description: description ?? faker.lorem.sentence(),
    nationalId: nationalId ?? createNationalId('company'),
  }
}
