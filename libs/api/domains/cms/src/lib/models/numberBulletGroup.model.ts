import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

import { INumberBulletSection } from '../generated/contentfulTypes'

import { NumberBullet, mapNumberBullet } from './numberBullet.model'

@ObjectType()
export class NumberBulletGroup {
  constructor(initializer: NumberBulletGroup) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field(() => Int)
  defaultVisible: number

  @Field(() => [NumberBullet])
  bullets: NumberBullet[]
}

export const mapNumberBulletGroup = ({
  fields,
  sys,
}: INumberBulletSection): NumberBulletGroup =>
  new NumberBulletGroup({
    id: sys.id,
    defaultVisible: fields.defaultVisible,
    bullets: fields.bullets.map(mapNumberBullet),
  })
