import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'

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

@ObjectType()
export class DocumentProviderPaperMailResponse {
  @Field(() => [DocumentProviderPaperMail])
  paperMail!: Array<DocumentProviderPaperMail>

  @Field(() => Int)
  totalCount!: number
}
