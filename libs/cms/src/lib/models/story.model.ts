import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IStory } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'

@ObjectType()
export class Story {
  @Field()
  label!: string

  @Field()
  title!: string

  @CacheField(() => Image)
  logo!: Image

  @Field()
  readMoreText!: string

  @Field(() => String)
  date = ''

  @Field()
  intro!: string

  @Field()
  link?: string

  @Field({ nullable: true })
  linkedPage?: string

  @Field({ nullable: true })
  body?: string
}

export const mapStory = ({ fields, sys }: IStory): Story => ({
  label: fields.label ?? '',
  title: fields.title ?? '',
  logo: mapImage(fields.logo),
  date: sys.createdAt ?? '',
  readMoreText: fields.readMoreText ?? '',
  intro: fields.intro ?? '',
  linkedPage: fields.linkedPage ? JSON.stringify(fields.linkedPage) : '',
  link: fields.link ?? '',
  body: fields.body ? JSON.stringify(fields.body) : '',
})
