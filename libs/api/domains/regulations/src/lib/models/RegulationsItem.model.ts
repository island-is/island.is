import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RegulationsItem {
  @Field()
  title!: string
  @Field()
  name!: string
  @Field(() => Date)
  publishedDate!: string
}
