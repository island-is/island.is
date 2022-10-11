import faker from 'faker'

import { ApiScopeGroup } from '@island.is/auth-api-lib'

export type CreateApiScopeGroup = Pick<
  ApiScopeGroup,
  'id' | 'name' | 'displayName' | 'description' | 'order'
>

export type CreateApiScopeGroupOptions = Partial<CreateApiScopeGroup>

export const createApiScopeGroup = ({
  id,
  name,
  displayName,
  description,
  order,
}: CreateApiScopeGroupOptions): CreateApiScopeGroup => {
  return {
    id: id ?? faker.datatype.uuid(),
    name: name ?? faker.random.word(),
    order: order ?? 0,
    displayName: displayName ?? faker.random.word(),
    description: description ?? faker.lorem.sentence(),
  }
}
