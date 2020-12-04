import { IIconBullet, INumberBulletSection } from '../generated/contentfulTypes'
import {
  mapNumberBulletGroup,
} from './numberBulletGroup.model'
import { mapIconBullet } from './iconBullet.model'
import { BulletEntryUnion } from '../unions/buttonEntry.union'

export const mapBulletEntry = (
  entry: IIconBullet | INumberBulletSection,
): typeof BulletEntryUnion => {
  switch (entry.sys.contentType.sys.id) {
    case 'iconBullet':
      return mapIconBullet(entry as IIconBullet)

    case 'numberBulletSection':
      return mapNumberBulletGroup(entry as INumberBulletSection)
  }
}
