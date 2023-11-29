import { Field, ObjectType, createUnionType } from '@nestjs/graphql'
import { Design } from './design.model'
import { Trademark } from './trademark.model'
import { Patent } from './patent.model'

export const IntellectualProperty = createUnionType({
  name: 'IntellectualProperty',
  types: () => [Design, Trademark, Patent] as const,
  resolveType(value) {
    if (value.hId) {
      return 'IntellectualPropertiesDesign'
    }
    if (value.vmId) {
      return 'IntellectualPropertiesTrademark'
    }
    return 'IntellectualPropertiesPatent'
  },
})

@ObjectType('IntellectualPropertiesPaginated')
export class PaginatedData {
  @Field(() => [IntellectualProperty])
  data!: Array<typeof IntellectualProperty>

  @Field()
  totalCount!: number

  @Field(() => PageInfoDto)
  pageInfo!: PageInfoDto
}
