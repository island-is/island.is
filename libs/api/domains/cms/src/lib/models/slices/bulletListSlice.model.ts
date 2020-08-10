import { Field, ID, ObjectType } from '@nestjs/graphql'
import { BulletEntry } from '../bullets/bulletEntry.model'

@ObjectType()
export class BulletListSlice {
  constructor(initializer: BulletListSlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field(() => [BulletEntry])
  bullets: Array<typeof BulletEntry>
}
