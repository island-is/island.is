import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { SystemMetadata } from 'api-cms-domain'

import { INumberBulletSection } from '../generated/contentfulTypes'

import { mapNumberBullet,NumberBullet } from './numberBullet.model'

@ObjectType()
export class NumberBulletGroup {
  @Field(() => ID)
  id!: string

  @Field(() => Int)
  defaultVisible!: number

  @Field(() => [NumberBullet])
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
