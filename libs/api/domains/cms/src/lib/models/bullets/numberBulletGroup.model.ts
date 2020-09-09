import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { NumberBullet, mapNumberBullet } from './numberBullet.model'
import { INumberBulletSection } from '../../generated/contentfulTypes'

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
