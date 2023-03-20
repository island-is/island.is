import { createUnionType } from '@nestjs/graphql'
import { ApiScopeGroup } from './apiScopeGroup.model'
import { ApiScope } from './apiScope.model'

export const ScopeTreeNode = createUnionType({
  name: 'AuthScopeTreeNode',
  types: () => [ApiScope, ApiScopeGroup],
  resolveType: (args) => {
    return args.children?.length ? ApiScopeGroup : ApiScope
  },
})
