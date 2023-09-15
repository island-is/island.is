import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IIconBullet } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class IconBullet {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  body!: string

  @CacheField(() => Image)
  icon!: Image

  @Field({ nullable: true })
  url!: string

  @Field({ nullable: true })
  linkText!: string
}

export const mapIconBullet = ({
  fields,
  sys,
}: IIconBullet): SystemMetadata<IconBullet> => ({
  typename: 'IconBullet',
  id: sys.id,
  title: fields.title ?? '',
  body: fields.body ?? '',
  icon: mapImage(fields.icon),
  url: fields.url ?? '',
  linkText: fields.linkText ?? '',
})
