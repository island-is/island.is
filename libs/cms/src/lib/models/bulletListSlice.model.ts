import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { IBigBulletList } from '../generated/contentfulTypes'
import {
  BulletEntryUnion,
  mapBulletEntryUnion,
} from '../unions/bulletEntry.union'

@ObjectType()
export class BulletListSlice {
  @Field(() => ID)
  id!: string

  @CacheField(() => [BulletEntryUnion])
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
