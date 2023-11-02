import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IVidspyrnaFlokkur } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { AdgerdirPage, mapAdgerdirPage } from './adgerdirPage.model'

@ObjectType()
export class AdgerdirGroupSlice {
  constructor(initializer: AdgerdirGroupSlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  subtitle!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description!: string

  @CacheField(() => Image, { nullable: true })
  image?: Image | null

  @CacheField(() => [AdgerdirPage])
  pages!: AdgerdirPage[]
}

export const mapAdgerdirGroupSlice = ({
  fields,
  sys,
}: IVidspyrnaFlokkur): AdgerdirGroupSlice =>
  new AdgerdirGroupSlice({
    id: sys?.id ?? '',
    title: fields?.title ?? '',
    subtitle: fields?.subtitle ?? '',
    description: fields?.description ?? '',
    image: fields?.image?.fields?.file ? mapImage(fields.image) : null,
    pages: fields?.pages ? fields.pages.map(mapAdgerdirPage) : [],
  })
