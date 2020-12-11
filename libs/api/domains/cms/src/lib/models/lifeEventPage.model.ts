import { Field, ObjectType, ID } from '@nestjs/graphql'
import { ILifeEventPage } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { ArticleCategory, mapArticleCategory } from './articleCategory.model'
import { mapDocument } from './slice.model'
import { SliceUnion } from '../unions/slice.union'

@ObjectType()
export class LifeEventPage {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field({ nullable: true })
  intro?: string

  @Field({ nullable: true })
  image?: Image

  @Field({ nullable: true })
  thumbnail?: Image

  @Field(() => [SliceUnion])
  content: Array<typeof SliceUnion>

  @Field(() => ArticleCategory, { nullable: true })
  category?: ArticleCategory
}

export const mapLifeEventPage = ({
  fields,
  sys,
}: ILifeEventPage): LifeEventPage => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  intro: fields.intro ?? '',
  image: mapImage(fields.image),
  thumbnail: mapImage(fields.thumbnail),
  content: fields?.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  category: fields.category ? mapArticleCategory(fields.category) : null,
})
