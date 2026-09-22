import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('IncomeValidationRowError')
export class IncomeValidationRowError {
  @Field(() => String)
  validationId!: string

  @Field(() => String, { nullable: true })
  reason?: string | null

  @Field(() => String, { nullable: true })
  reasonEN?: string | null
}

@ObjectType('IncomeValidationResult')
export class IncomeValidationResult {
  @Field(() => Boolean)
  isValid!: boolean

  @Field(() => [String], { nullable: true })
  invalidValidationIds?: string[] | null

  // per-row errors correlated back to the request via validationId/referenceId
  @Field(() => [IncomeValidationRowError], { nullable: true })
  errors?: IncomeValidationRowError[] | null
}
