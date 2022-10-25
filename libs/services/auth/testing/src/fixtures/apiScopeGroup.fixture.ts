import { ApiScopeGroup } from '@island.is/auth-api-lib'
import faker from 'faker'

export type CreateApiScopeGroup = Pick<
  ApiScopeGroup,
  'id' | 'name' | 'displayName' | 'description' | 'order' | 'domainName'
>

export type CreateApiScopeGroupOptions = Partial<CreateApiScopeGroup> &
  Pick<CreateApiScopeGroup, 'domainName'>

export const createApiScopeGroup = ({
  id,
  name,
  displayName,
  description,
  order,
  domainName,
}: CreateApiScopeGroupOptions): CreateApiScopeGroup => {
  return {
    id: id ?? faker.datatype.uuid(),
    name: name ?? faker.random.word(),
    domainName,
    order: order ?? 0,
    displayName: displayName ?? faker.random.word(),
    description: description ?? faker.lorem.sentence(),
  }
}
