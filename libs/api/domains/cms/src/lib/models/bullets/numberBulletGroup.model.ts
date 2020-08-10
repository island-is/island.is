import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { NumberBullet } from './numberBullet.model'

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
