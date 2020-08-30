import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Image, mapImage } from '../image.model'
import {ILogoListSlice} from '../../generated/contentfulTypes'

@ObjectType()
export class LogoListSlice {
  constructor(initializer: LogoListSlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string

  @Field(() => [Image])
  images: Image[]
}

export const mapLogoListSlice = ({
  fields,
  sys,
}: ILogoListSlice): LogoListSlice =>
  new LogoListSlice({
    id: sys.id,
    title: fields.title ?? '',
    body: fields.body ?? '',
    images: (fields.images ?? []).map(mapImage),
  })
