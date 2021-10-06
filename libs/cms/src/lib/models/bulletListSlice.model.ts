import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IBigBulletList } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'
import {
  BulletEntryUnion,
  mapBulletEntryUnion,
} from '../unions/bulletEntry.union'
@ObjectType()
export class BulletListSlice {
  @Field(() => ID)
  id!: string

  @Field(() => [BulletEntryUnion])
  bullets!: Array<typeof BulletEntryUnion>
}

export const mapBulletListSlice = ({
  fields,
  sys,
}: IBigBulletList): SystemMetadata<BulletListSlice> => ({
  typename: 'BulletListSlice',
  id: sys.id,
  bullets: (fields.bullets ?? []).map(mapBulletEntryUnion),
})
