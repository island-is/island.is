import { createUnionType } from '@nestjs/graphql'
import { IconBullet } from '../models/iconBullet.model'
import { NumberBulletGroup } from '../models/numberBulletGroup.model'

export const BulletEntryUnion = createUnionType({
  name: 'BulletEntry',
  types: () => [IconBullet, NumberBulletGroup],
})
