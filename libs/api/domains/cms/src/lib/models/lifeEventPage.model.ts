import { Field, ObjectType, ID } from '@nestjs/graphql'
import {
  ILifeEventPage,
  ILifeEventPageFields,
} from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { ArticleCategory, mapArticleCategory } from './articleCategory.model'
import { mapDocument, SliceUnion } from '../unions/slice.union'
import { Entry } from 'contentful'

@ObjectType()
export class LifeEventPage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field({ nullable: true })
  intro?: string

  @Field(() => Image, { nullable: true })
  image?: Image | null

  @Field(() => Image, { nullable: true })
  thumbnail?: Image | null

  @Field(() => [SliceUnion])
  content!: Array<typeof SliceUnion>

  @Field(() => ArticleCategory, { nullable: true })
  category?: ArticleCategory | null
}

export const mapLifeEventPage = ({
  fields,
  sys,
}: ILifeEventPage): LifeEventPage => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  intro: fields.intro ?? '',
  image: fields.image ? mapImage(fields.image) : null,
  thumbnail: fields.thumbnail ? mapImage(fields.thumbnail) : null,
  content: fields?.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  category: fields.category ? mapArticleCategory(fields.category) : null,
})
