import { Field, ObjectType } from '@nestjs/graphql';
import { Image } from './image.model'

@ObjectType()
export class Story {
  @Field()
  label: string

  @Field()
  title: string

  @Field(type => Image)
  logo: Image

  @Field()
  readMoreText: string

  @Field()
  date: string

  @Field()
  intro: string

  @Field({ nullable: true })
  body?: string
}
