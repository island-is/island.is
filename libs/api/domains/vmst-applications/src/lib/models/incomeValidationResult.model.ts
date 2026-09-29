import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('VmstApplicationsIncomeValidationRowError')
export class VmstApplicationsIncomeValidationRowError {
  @Field(() => String)
  validationId!: string

  @Field(() => String, { nullable: true })
  reason?: string | null

  @Field(() => String, { nullable: true })
  reasonEN?: string | null
}

@ObjectType('VmstApplicationsIncomeValidationResult')
export class VmstApplicationsIncomeValidationResult {
  @Field(() => Boolean)
  isValid!: boolean

  @Field(() => [String], { nullable: true })
  invalidValidationIds?: string[] | null

  // per-row errors correlated back to the request via validationId/referenceId
  @Field(() => [VmstApplicationsIncomeValidationRowError], { nullable: true })
  errors?: VmstApplicationsIncomeValidationRowError[] | null
}
