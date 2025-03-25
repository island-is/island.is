import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('SeminarsCompanyValidationItem')
export class CompanyValidationItem {
  @Field(() => String, { nullable: true })
  nationalId?: string | null

  @Field(() => Boolean, { nullable: true })
  mayPayWithAnAccount?: boolean | null
}
