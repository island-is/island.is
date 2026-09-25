import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType('VmstApplicantIrregularJob')
export class VmstApplicantIrregularJob {
  @Field(() => String)
  id!: string

  @Field(() => String)
  employerName!: string

  @Field(() => String)
  employerSSN!: string

  @Field(() => String)
  periodFrom!: string

  @Field(() => String, { nullable: true })
  periodTo?: string | null

  @Field(() => Float)
  estimatedIncome!: number
}

@ObjectType('VmstApplicantPartTimeJob')
export class VmstApplicantPartTimeJob {
  @Field(() => String)
  id!: string

  @Field(() => String)
  employerName!: string

  @Field(() => String)
  employerSSN!: string

  @Field(() => String)
  periodFrom!: string

  @Field(() => String, { nullable: true })
  periodTo?: string | null

  @Field(() => Float, { nullable: true })
  ratio?: number | null

  @Field(() => Float)
  estimatedIncome!: number
}

@ObjectType('VmstApplicantPensionPayment')
export class VmstApplicantPensionPayment {
  @Field(() => String)
  id!: string

  @Field(() => String)
  incomeTypeId!: string

  @Field(() => String, { nullable: true })
  pensionFundId?: string | null

  @Field(() => Float)
  estimatedIncome!: number

  @Field(() => String)
  periodFrom!: string

  @Field(() => String, { nullable: true })
  periodTo?: string | null
}

@ObjectType('VmstApplicantCapitalIncomePayment')
export class VmstApplicantCapitalIncomePayment {
  @Field(() => String)
  id!: string

  @Field(() => String)
  incomeTypeId!: string

  @Field(() => Float)
  estimatedIncome!: number

  @Field(() => String)
  periodFrom!: string

  @Field(() => String, { nullable: true })
  periodTo?: string | null
}

@ObjectType('VmstApplicantTRPayment')
export class VmstApplicantTRPayment {
  @Field(() => String)
  id!: string

  @Field(() => String)
  incomeTypeId!: string

  @Field(() => Float)
  estimatedIncome!: number

  @Field(() => String)
  periodFrom!: string

  @Field(() => String, { nullable: true })
  periodTo?: string | null
}

@ObjectType('VmstApplicantContractorJob')
export class VmstApplicantContractorJob {
  @Field(() => String)
  id!: string

  @Field(() => String)
  startDate!: string

  @Field(() => String)
  endDate!: string
}

@ObjectType('VmstApplicantIncomes')
export class VmstApplicantIncomes {
  @Field(() => [VmstApplicantIrregularJob])
  irregularJobs!: VmstApplicantIrregularJob[]

  @Field(() => [VmstApplicantPartTimeJob])
  partTimeJobs!: VmstApplicantPartTimeJob[]

  @Field(() => [VmstApplicantPensionPayment])
  pensionPayments!: VmstApplicantPensionPayment[]

  @Field(() => [VmstApplicantCapitalIncomePayment])
  capitalIncomePayments!: VmstApplicantCapitalIncomePayment[]

  @Field(() => [VmstApplicantTRPayment])
  trPayments!: VmstApplicantTRPayment[]

  @Field(() => [VmstApplicantContractorJob])
  contractorJobs!: VmstApplicantContractorJob[]
}
