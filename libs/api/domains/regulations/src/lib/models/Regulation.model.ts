import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Regulation {
  @Field()
  type!: string
  @Field()
  name!: string
  @Field()
  title!: string
  @Field()
  text!: string
  @Field(() => Date)
  publishedDate!: string
  @Field(() => Date)
  signatureDate!: string
  @Field(() => Date)
  effectiveDate!: string
  @Field()
  appendixes?: []
  @Field(() => Date)
  lastAmendDate!: string
  @Field()
  ministry!: {}
  @Field()
  lawChapters!: []
  @Field()
  history?: []
  @Field()
  effects?: []
  @Field(() => Date)
  timelineDate?: string
  @Field()
  showingDiff?: {}
}
