import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { NumberBullet } from './numberBullet.model'

@ObjectType()
export class NumberBulletGroup {
  constructor(initializer: NumberBulletGroup) {
    Object.assign(this, initializer);
  }

  @Field((type) => ID)
  id: string

  @Field((type) => Int)
  defaultVisible: number

  @Field((type) => [NumberBullet])
  bullets: NumberBullet[]
}
