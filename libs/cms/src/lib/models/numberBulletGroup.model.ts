import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

import { INumberBulletSection } from '../generated/contentfulTypes'
import { NumberBullet, mapNumberBullet } from './numberBullet.model'

@ObjectType()
export class NumberBulletGroup {
  @Field(() => ID)
  id!: string

  @Field(() => Int)
  defaultVisible!: number

  @CacheField(() => [NumberBullet])
  bullets!: NumberBullet[]
}

export const mapNumberBulletGroup = ({
  fields,
  sys,
}: INumberBulletSection): SystemMetadata<NumberBulletGroup> => ({
  typename: 'NumberBulletGroup',
  id: sys.id,
  defaultVisible: fields.defaultVisible ?? 5,
  bullets: (fields.bullets ?? []).map(mapNumberBullet),
})
