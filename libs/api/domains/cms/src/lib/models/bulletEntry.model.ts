import { createUnionType } from '@nestjs/graphql'

import { IIconBullet, INumberBulletSection } from '../generated/contentfulTypes'

import {
  NumberBulletGroup,
  mapNumberBulletGroup,
} from './numberBulletGroup.model'
import { IconBullet, mapIconBullet } from './iconBullet.model'

export const BulletEntry = createUnionType({
  name: 'BulletEntry',
  types: () => [IconBullet, NumberBulletGroup],
})

export const mapBulletEntry = (
  entry: IIconBullet | INumberBulletSection,
): typeof BulletEntry => {
  switch (entry.sys.contentType.sys.id) {
    case 'iconBullet':
      return mapIconBullet(entry as IIconBullet)

    case 'numberBulletSection':
      return mapNumberBulletGroup(entry as INumberBulletSection)
  }
}
