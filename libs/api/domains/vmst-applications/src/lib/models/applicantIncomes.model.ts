import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  InterfaceType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'

export enum VmstApplicantIncomeRowType {
  IrregularJob = 'IrregularJob',
  PartTimeJob = 'PartTimeJob',
  PensionPayment = 'PensionPayment',
  CapitalIncomePayment = 'CapitalIncomePayment',
  TRPayment = 'TRPayment',
  ContractorJob = 'ContractorJob',
}

registerEnumType(VmstApplicantIncomeRowType, {
  name: 'VmstApplicantIncomeRowType',
})

@ObjectType('VmstApplicantPeriod')
export class VmstApplicantPeriod {
  @Field(() => GraphQLISODateTime)
  from!: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  to?: Date | null
}

const exhaustiveCheck = (param: never) => {
  throw new Error(`Missing interfaceType ${param}`)
}

@InterfaceType('VmstApplicantIncomeRow', {
  resolveType(row: VmstApplicantIncomeRow) {
    switch (row.type) {
      case VmstApplicantIncomeRowType.IrregularJob:
        return VmstApplicantIrregularJob
      case VmstApplicantIncomeRowType.PartTimeJob:
        return VmstApplicantPartTimeJob
      case VmstApplicantIncomeRowType.PensionPayment:
        return VmstApplicantPensionPayment
      case VmstApplicantIncomeRowType.CapitalIncomePayment:
        return VmstApplicantCapitalIncomePayment
      case VmstApplicantIncomeRowType.TRPayment:
        return VmstApplicantTRPayment
      case VmstApplicantIncomeRowType.ContractorJob:
        return VmstApplicantContractorJob
      default:
        return exhaustiveCheck(row.type)
    }
  },
})
export abstract class VmstApplicantIncomeRow {
  @Field(() => ID)
  id!: string

  @Field(() => VmstApplicantIncomeRowType)
  type!: VmstApplicantIncomeRowType

  @Field(() => VmstApplicantPeriod)
  period!: VmstApplicantPeriod

  // Nullable because contractor jobs report no estimated income.
  @Field(() => Float, { nullable: true })
  estimatedIncome?: number | null
}

@ObjectType('VmstApplicantIrregularJob', {
  implements: () => [VmstApplicantIncomeRow],
})
export class VmstApplicantIrregularJob extends VmstApplicantIncomeRow {
  @Field(() => String, { nullable: true })
  employerName?: string | null

  @Field(() => String, { nullable: true })
  employerSSN?: string | null
}

@ObjectType('VmstApplicantPartTimeJob', {
  implements: () => [VmstApplicantIncomeRow],
})
export class VmstApplicantPartTimeJob extends VmstApplicantIncomeRow {
  @Field(() => String, { nullable: true })
  employerName?: string | null

  @Field(() => String, { nullable: true })
  employerSSN?: string | null

  @Field(() => Float, { nullable: true })
  ratio?: number | null
}

@ObjectType('VmstApplicantPensionPayment', {
  implements: () => [VmstApplicantIncomeRow],
})
export class VmstApplicantPensionPayment extends VmstApplicantIncomeRow {
  @Field(() => String, { nullable: true })
  employerName?: string | null

  @Field(() => String)
  incomeTypeId!: string

  @Field(() => String, { nullable: true })
  pensionFundId?: string | null
}

@ObjectType('VmstApplicantCapitalIncomePayment', {
  implements: () => [VmstApplicantIncomeRow],
})
export class VmstApplicantCapitalIncomePayment extends VmstApplicantIncomeRow {
  @Field(() => String)
  incomeTypeId!: string
}

@ObjectType('VmstApplicantTRPayment', {
  implements: () => [VmstApplicantIncomeRow],
})
export class VmstApplicantTRPayment extends VmstApplicantIncomeRow {
  @Field(() => String)
  incomeTypeId!: string
}

@ObjectType('VmstApplicantContractorJob', {
  implements: () => [VmstApplicantIncomeRow],
})
export class VmstApplicantContractorJob extends VmstApplicantIncomeRow {}
