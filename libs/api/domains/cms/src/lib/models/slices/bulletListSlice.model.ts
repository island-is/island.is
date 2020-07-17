import { Field, ID, ObjectType } from '@nestjs/graphql'
import { BulletEntry } from '../bullets/bulletEntry.model'

@ObjectType()
export class BulletListSlice {
  constructor(initializer: BulletListSlice) {
    Object.assign(this, initializer);
  }

  @Field((type) => ID)
  id: string

  @Field((type) => [BulletEntry])
  bullets: Array<typeof BulletEntry>
}
