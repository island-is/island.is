import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class InsuranceCompany {
  @Field(() => String, { nullable: true })
  code?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null
}
