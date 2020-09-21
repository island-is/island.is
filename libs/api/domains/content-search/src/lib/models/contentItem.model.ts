import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ContentItem {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  title: string

  @Field({ nullable: true })
  content: string

  @Field(() => [String], { nullable: true })
  tag: string[]

  @Field({ nullable: true })
  category: string

  @Field({ nullable: true })
  categorySlug: string

  @Field({ nullable: true })
  categoryDescription: string

  @Field({ nullable: true })
  containsApplicationForm: boolean

  @Field({ nullable: true })
  importance: number

  @Field({ nullable: true })
  group: string

  @Field({ nullable: true })
  subgroup: string

  @Field({ nullable: true })
  groupSlug: string

  @Field({ nullable: true })
  groupDescription: string

  @Field({ nullable: true })
  contentBlob: string

  @Field({ nullable: true })
  contentId: string

  @Field({ nullable: true })
  contentType: string

  @Field({ nullable: true })
  date: string

  @Field({ nullable: true })
  image: string

  @Field({ nullable: true })
  imageText: string

  @Field({ nullable: true })
  lang: string

  @Field({ nullable: true })
  slug: string
}
