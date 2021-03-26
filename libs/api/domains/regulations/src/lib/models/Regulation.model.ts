import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Regulation {
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
}
