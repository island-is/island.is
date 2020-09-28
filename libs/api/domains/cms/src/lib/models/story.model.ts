import { Field, ObjectType } from '@nestjs/graphql'
import { IStory } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { LinkedPage, mapLinkedPage } from './linkedPage.model'

@ObjectType()
export class Story {
  @Field()
  label: string

  @Field()
  title: string

  @Field(() => Image)
  logo: Image

  @Field()
  readMoreText: string

  @Field()
  date: string

  @Field()
  intro: string

  @Field()
  link: string

  @Field({ nullable: true })
  body?: string

  @Field(() => LinkedPage, { nullable: true })
  page?: LinkedPage
}

export const mapStory = ({ fields, sys }: IStory): Story => ({
  label: fields.label ?? '',
  title: fields.title ?? '',
  logo: mapImage(fields.logo),
  date: sys.createdAt,
  readMoreText: fields.readMoreText,
  intro: fields.intro,
  link: fields.link ?? '',
  body: fields.body && JSON.stringify(fields.body),
  page: fields.page ? mapLinkedPage(fields.page) : null,
})
