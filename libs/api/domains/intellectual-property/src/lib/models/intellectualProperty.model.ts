import { createUnionType } from '@nestjs/graphql'
import { Design } from './getDesign.model'
import { Trademark } from './getTrademark.model'
import { Patent } from './getPatent.model'

export const IntellectualProperty = createUnionType({
  name: 'IntellectualProperty',
  types: () => [Design, Trademark, Patent] as const,
  resolveType(value) {
    if (value.hId) {
      return 'IntellectualPropertyDesign'
    }
    if (value.vmId) {
      return 'IntellectualPropertyTrademark'
    }
    return 'IntellectualPropertyPatent'
  },
})
