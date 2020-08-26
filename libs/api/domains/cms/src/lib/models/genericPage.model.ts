import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GenericPage {
  @Field()
  title: string

  @Field()
  slug: string

  @Field({ nullable: true })
  intro?: string

  @Field({ nullable: true })
  mainContent?: string

  @Field({ nullable: true })
  sidebar?: string

  @Field({ nullable: true })
  misc?: string
}
