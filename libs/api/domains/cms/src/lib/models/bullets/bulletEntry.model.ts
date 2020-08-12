import { createUnionType } from '@nestjs/graphql'
import { NumberBulletGroup } from './numberBulletGroup.model'
import { IconBullet } from './iconBullet.model'

export const BulletEntry = createUnionType({
  name: 'BulletEntry',
  types: () => [IconBullet, NumberBulletGroup],
})
