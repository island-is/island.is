import { Field, ID, ObjectType } from '@nestjs/graphql'
import { BulletEntry, mapBulletEntry } from '../bullets/bulletEntry.model'
import { IBigBulletList } from '../../generated/contentfulTypes'

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

export const mapBulletListSlice = ({
  fields,
  sys,
}: IBigBulletList): BulletListSlice =>
  new BulletListSlice({
    id: sys.id,
    bullets: fields.bullets.map(mapBulletEntry),
  })
