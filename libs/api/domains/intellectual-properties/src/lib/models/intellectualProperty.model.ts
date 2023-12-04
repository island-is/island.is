import { Field, Int, ObjectType, createUnionType } from '@nestjs/graphql'
import { Design } from './design.model'
import { Trademark } from './trademark.model'
import { Patent } from './patent.model'

export const IntellectualProperty = createUnionType({
  name: 'IntellectualProperty',
  types: () => [Design, Trademark, Patent] as const,
  resolveType(value) {
    if (value.hId) {
      return Design
    }
    if (value.vmId) {
      return Trademark
    }
    return Patent
  },
})

@ObjectType('IntellectualPropertiesResponse')
export class IntellectualPropertiesResponse {
  @Field(() => [IntellectualProperty, { nullable: true }])
  items?: Array<typeof IntellectualProperty>

  @Field(() => Int)
  totalCount!: number
}
