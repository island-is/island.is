import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DocumentProviderPaperMail {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  origin!: string

  @Field(() => Boolean)
  wantsPaper!: boolean

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateAdded?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateUpdated?: Date
}
