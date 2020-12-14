import { createUnionType } from '@nestjs/graphql'
import { IconBullet } from '../models/iconBullet.model'
import { NumberBulletGroup } from '../models/numberBulletGroup.model'
import { IIconBullet, INumberBulletSection } from '../generated/contentfulTypes'
import { mapNumberBulletGroup } from '../models/numberBulletGroup.model'
import { mapIconBullet } from '../models/iconBullet.model'

export const BulletEntryUnion = createUnionType({
  name: 'BulletEntry',
  types: () => [IconBullet, NumberBulletGroup],
})

export const mapBulletEntryUnion = (
  entry: IIconBullet | INumberBulletSection,
): typeof BulletEntryUnion => {
  switch (entry.sys.contentType.sys.id) {
    case 'iconBullet':
      return mapIconBullet(entry as IIconBullet)

    case 'numberBulletSection':
      return mapNumberBulletGroup(entry as INumberBulletSection)
  }
}
