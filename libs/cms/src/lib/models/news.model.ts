import { Field, ObjectType, ID } from '@nestjs/graphql'
import { INews } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class News {
  @Field(() => ID)
  id!: string

  @Field()
  slug!: string

  @Field()
  title!: string

  @Field()
  subtitle!: string

  @Field({ nullable: true })
  intro!: string

  @Field(() => Image, { nullable: true })
  image!: Image

  @Field()
  date!: string

  @Field(() => [SliceUnion], { nullable: true })
  content: Array<typeof SliceUnion> = []

  @Field(() => [GenericTag])
  genericTags: GenericTag[] = []
}

export const mapNews = ({ fields, sys }: INews): News => ({
  id: sys.id,
  slug: fields.slug ?? '',
  title: fields.title ?? '',
  subtitle: fields.subtitle ?? '',
  intro: fields.intro ?? '',
  image: mapImage(fields.image),
  date: fields.date ?? '',
  content: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  genericTags: (fields.genericTags ?? []).map(mapGenericTag),
})
