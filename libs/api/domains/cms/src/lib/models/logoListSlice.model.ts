import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ILogoListSlice } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'
import { Image, mapImage } from './image.model'

@ObjectType()
export class LogoListSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field()
  body?: string

  @Field(() => [Image])
  images?: Image[]
}

export const mapLogoListSlice = ({
  fields,
  sys,
}: ILogoListSlice): SystemMetadata<LogoListSlice> => ({
  typename: 'LogoListSlice',
  id: sys.id,
  title: fields.title ?? '',
  body: fields.body ?? '',
  images: (fields.images ?? []).map(mapImage),
})
