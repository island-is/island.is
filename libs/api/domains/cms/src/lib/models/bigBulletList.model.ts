import { Field, ObjectType } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'

import {
  IBigBulletList,
  IIconBullet,
  INumberBulletSection,
} from '../generated/contentfulTypes'

import { IconBullet, mapIconBullet } from './iconBullet.model'
import {
  NumberBulletSection,
  mapNumberBulletSection,
} from './numberBulletSection.model'

@ObjectType()
export class BigBulletList {
  @Field({ nullable: true })
  title?: string

  @Field(() => [IconBullet, NumberBulletSection])
  bullets: Array<IconBullet | NumberBulletSection>
}

const mapSlice = (slice: IIconBullet | INumberBulletSection) => {
  switch (slice.sys.contentType.sys.id) {
    case 'iconBullet':
      return mapIconBullet(slice as IIconBullet)
    case 'numberBulletSection':
      return mapNumberBulletSection(slice as INumberBulletSection)

    default:
      throw new ApolloError(
        `Cannot convert to slice: ${
          (slice.sys.contentType.sys as { id: string }).id
        }`,
      )
  }
}

export const mapBigBulletList = ({
  fields,
}: IBigBulletList): BigBulletList => ({
  title: fields.title ?? '',
  bullets: fields.bullets.map(mapSlice),
})
