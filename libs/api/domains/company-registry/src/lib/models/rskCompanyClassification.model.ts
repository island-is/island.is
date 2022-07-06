import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RskCompanyClassification {
  @Field(() => String)
  type!: string

  @Field(() => String)
  classificationSystem!: string

  @Field(() => String)
  number!: string

  @Field(() => String)
  name!: string
}
