import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('PracticalExamCompanyValidationItem')
export class CompanyValidationItem {
  @Field(() => String, { nullable: true })
  nationalId?: string | null

  @Field(() => Boolean, { nullable: true })
  mayPayReceiveInvoice?: boolean | null
}
