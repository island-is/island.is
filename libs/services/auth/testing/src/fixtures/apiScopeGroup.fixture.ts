import { ApiScopeGroupDTO } from '@island.is/auth-api-lib'
import { faker } from '@faker-js/faker'
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
    id: id ?? faker.string.uuid(),
    name: name ?? faker.word.sample(),
    domainName: domainName ?? faker.word.sample(),
    order: order ?? 0,
    displayName: displayName ?? faker.word.sample(),
    description: description ?? faker.lorem.sentence(),
    apiScopes: [],
  }
}
