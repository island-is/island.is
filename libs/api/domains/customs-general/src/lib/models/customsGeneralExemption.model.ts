import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CustomsGeneralExemption {
  @Field(() => String, { nullable: true })
  code?: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  legalArticle?: string

  @Field(() => String, { nullable: true })
  validFrom?: string

  @Field(() => String, { nullable: true })
  validTo?: string

  @Field(() => String, { nullable: true })
  system?: string
}
