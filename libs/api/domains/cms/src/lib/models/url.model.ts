import { Field, ObjectType, ID, createUnionType } from '@nestjs/graphql'
import {
  IArticle,
  IArticleCategory,
  ILifeEventPage,
  INews,
  IUrl,
} from '../generated/contentfulTypes'

type UrlPageTypes = IArticle | IArticleCategory | INews | ILifeEventPage

export const mapPage = ({ fields, sys }: UrlPageTypes): UrlPage => ({
  id: sys.id,
  contentType: sys.contentType?.sys?.id ?? '',
  title: fields.title ?? '',
  slug: fields.slug ?? '',
})

@ObjectType()
export class UrlPage {
  @Field()
  id: string = ''
  @Field()
  contentType: string = ''
  @Field()
  title: string = ''
  @Field()
  slug: string = ''
}

@ObjectType()
export class Url {
  @Field(() => ID)
  id: string = ''

  @Field({ nullable: true })
  title?: string

  @Field(() => UrlPage)
  page?: UrlPage | null

  @Field(() => [String])
  urlsList: Array<string> = []
}

export const mapUrl = ({ fields, sys }: IUrl): Url => ({
  id: sys.id,
  title: fields.title ?? '',
  page: fields.page ? mapPage(fields.page) : null,
  urlsList: fields.urlsList ?? [],
})
