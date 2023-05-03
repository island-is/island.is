import { createUnionType } from '@nestjs/graphql'

import { ConsentScope } from './consentScope.model'
import { ConsentScopeGroup } from './consentScopeGroup.model'

export const ConsentScopeTreeNode = createUnionType({
  name: 'AuthConsentScopeTreeNode',
  types: () => [ConsentScope, ConsentScopeGroup],
  resolveType: (args) => {
    return args.children?.length ? ConsentScopeGroup : ConsentScope
  },
})
