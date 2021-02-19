import { Field, ObjectType } from '@nestjs/graphql'

import { IVidspyrnaFlokkur } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { VidspyrnaPage, mapVidspyrnaPage } from './vidspyrnaPage.model'

@ObjectType()
export class VidspyrnaFlokkur {
  @Field()
  subtitle: string

  @Field()
  title: string

  @Field()
  description: string

  @Field({ nullable: true })
  image?: Image

  @Field(() => [VidspyrnaPage])
  pages: Array<VidspyrnaPage>
}

export const mapVidspyrnaFlokkur = ({
  fields,
}: IVidspyrnaFlokkur): VidspyrnaFlokkur => ({
  subtitle: fields.subtitle,
  title: fields.title,
  description: fields.description,
  image: mapImage(fields.image),
  pages: fields.pages.map(mapVidspyrnaPage),
})
