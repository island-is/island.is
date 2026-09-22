import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType('VmstApplicantIrregularJob')
export class VmstApplicantIrregularJob {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  employerName?: string

  @Field(() => String, { nullable: true })
  employerSSN?: string

  @Field(() => String, { nullable: true })
  periodFrom?: string

  @Field(() => String, { nullable: true })
  periodTo?: string | null

  @Field(() => Float, { nullable: true })
  estimatedIncome?: number
}

@ObjectType('VmstApplicantPartTimeJob')
export class VmstApplicantPartTimeJob {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  employerName?: string

  @Field(() => String, { nullable: true })
  employerSSN?: string

  @Field(() => String, { nullable: true })
  periodFrom?: string

  @Field(() => String, { nullable: true })
  periodTo?: string | null

  @Field(() => Float, { nullable: true })
  ratio?: number | null

  @Field(() => Float, { nullable: true })
  estimatedIncome?: number
}

@ObjectType('VmstApplicantPensionPayment')
export class VmstApplicantPensionPayment {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  incomeTypeId?: string

  @Field(() => String, { nullable: true })
  pensionFundId?: string

  @Field(() => Float, { nullable: true })
  estimatedIncome?: number

  @Field(() => String, { nullable: true })
  periodFrom?: string

  @Field(() => String, { nullable: true })
  periodTo?: string | null
}

@ObjectType('VmstApplicantCapitalIncomePayment')
export class VmstApplicantCapitalIncomePayment {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  incomeTypeId?: string

  @Field(() => Float, { nullable: true })
  estimatedIncome?: number

  @Field(() => String, { nullable: true })
  periodFrom?: string

  @Field(() => String, { nullable: true })
  periodTo?: string | null
}

@ObjectType('VmstApplicantTRPayment')
export class VmstApplicantTRPayment {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  incomeTypeId?: string

  @Field(() => Float, { nullable: true })
  estimatedIncome?: number

  @Field(() => String, { nullable: true })
  periodFrom?: string

  @Field(() => String, { nullable: true })
  periodTo?: string | null
}

@ObjectType('VmstApplicantContractorJob')
export class VmstApplicantContractorJob {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  startDate?: string

  @Field(() => String, { nullable: true })
  endDate?: string
}

@ObjectType('VmstApplicantIncomes')
export class VmstApplicantIncomes {
  @Field(() => [VmstApplicantIrregularJob], { nullable: true })
  irregularJobs?: VmstApplicantIrregularJob[]

  @Field(() => [VmstApplicantPartTimeJob], { nullable: true })
  partTimeJobs?: VmstApplicantPartTimeJob[]

  @Field(() => [VmstApplicantPensionPayment], { nullable: true })
  pensionPayments?: VmstApplicantPensionPayment[]

  @Field(() => [VmstApplicantCapitalIncomePayment], { nullable: true })
  capitalIncomePayments?: VmstApplicantCapitalIncomePayment[]

  @Field(() => [VmstApplicantTRPayment], { nullable: true })
  trPayments?: VmstApplicantTRPayment[]

  @Field(() => [VmstApplicantContractorJob], { nullable: true })
  contractorJobs?: VmstApplicantContractorJob[]
}
