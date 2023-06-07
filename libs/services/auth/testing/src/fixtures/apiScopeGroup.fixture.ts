import { ApiScopeGroupDTO } from '@island.is/auth-api-lib'
import faker from 'faker'
import { CreateApiScope } from './types'

export type CreateApiScopeGroup = Partial<ApiScopeGroupDTO> & {
  id?: string
  apiScopes?: CreateApiScope[]
}

export type CreateApiScopeGroupOptions = Partial<CreateApiScopeGroup> &
  Pick<CreateApiScopeGroup, 'domainName'>

export const createApiScopeGroup = ({
  id,
  name,
  displayName,
  description,
  order,
  domainName,
}: CreateApiScopeGroupOptions): Required<CreateApiScopeGroup> => {
  return {
    id: id ?? faker.datatype.uuid(),
    name: name ?? faker.random.word(),
    domainName: domainName ?? faker.random.word(),
    order: order ?? 0,
    displayName: displayName ?? faker.random.word(),
    description: description ?? faker.lorem.sentence(),
    apiScopes: [],
  }
}
