import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class MinistryModel {
  @Field()
  name!: string
  @Field()
  slug!: string
}
