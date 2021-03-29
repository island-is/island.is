import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class LawChapterModel {
  @Field()
  name!: string
  @Field()
  slug!: string
}
