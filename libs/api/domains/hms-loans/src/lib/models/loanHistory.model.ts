import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HmsLoansProperty')
export class Property {
  @Field(() => String, { nullable: true })
  propertyId?: string

  @Field(() => String, { nullable: true })
  propertyAddress?: string

  @Field(() => String, { nullable: true })
  propertyMunicipality?: string

  @Field(() => String, { nullable: true })
  epilog?: string

  @Field(() => String, { nullable: true })
  municipalityNumber?: string
}

@ObjectType('HmsLoansCoPayer')
export class CoPayer {
  @Field(() => String, { nullable: true })
  coPayerName?: string

  @Field(() => String, { nullable: true })
  coPayerNationalId?: string
}

@ObjectType('HmsLoansLoanHistory')
export class LoanHistory {
  @Field(() => Number, { nullable: true })
  loanId?: number

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  homeAddress?: string

  @Field(() => Number, { nullable: true })
  postNumber?: number

  @Field(() => String, { nullable: true })
  municipality?: string

  @Field(() => Date, { nullable: true })
  firstInterestDate?: Date

  @Field(() => Date, { nullable: true })
  firstPaymentDate?: Date

  @Field(() => Number, { nullable: true })
  totalNumberOfPayments?: number

  @Field(() => Number, { nullable: true })
  numberOfPaymentPerYear?: number

  @Field(() => String, { nullable: true })
  balancePayment?: string

  @Field(() => String, { nullable: true })
  paymentFee?: string

  @Field(() => String, { nullable: true })
  paymentDelayment?: string

  @Field(() => String, { nullable: true })
  temporaryPaymentDelayment?: string

  @Field(() => String, { nullable: true })
  variableInterest?: string

  @Field(() => String, { nullable: true })
  affiliateLoan?: string

  @Field(() => String, { nullable: true })
  priceIndexType?: string

  @Field(() => Number, { nullable: true })
  baseIndex?: number

  @Field(() => Number, { nullable: true })
  interest?: number

  @Field(() => Number, { nullable: true })
  originalLoanAmount?: number

  @Field(() => Date, { nullable: true })
  nextPaymentDate?: Date

  @Field(() => Date, { nullable: true })
  lastPaymentDate?: Date

  @Field(() => Date, { nullable: true })
  lastUnpaidInvoiceDate?: Date

  @Field(() => Number, { nullable: true })
  numberOfPaymentDatesRemaining?: number

  @Field(() => Number, { nullable: true })
  statusSettlementPayment?: number

  @Field(() => Number, { nullable: true })
  lastPaymentAmount?: number

  @Field(() => Number, { nullable: true })
  totalDueAmount?: number

  @Field(() => Number, { nullable: true })
  balanceWithoutInterestPriceImprovements?: number

  @Field(() => Number, { nullable: true })
  accruedInterestPriceImprovements?: number

  @Field(() => Number, { nullable: true })
  remainingBalanceWithoutDebt?: number

  @Field(() => Number, { nullable: true })
  repaymentFee?: number

  @Field(() => Number, { nullable: true })
  loanAmountWithRepayment?: number

  @Field(() => String, { nullable: true })
  loanStatus?: string

  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => String, { nullable: true })
  propertyId?: string

  @Field(() => String, { nullable: true })
  propertyAddress?: string

  @Field(() => String, { nullable: true })
  propertyMunicipality?: string

  @Field(() => String, { nullable: true })
  epilog?: string

  @Field(() => String, { nullable: true })
  municipalityNumber?: string

  @Field(() => String, { nullable: true })
  loanType?: string

  @Field(() => Number, { nullable: true })
  installments?: number

  @Field(() => String, { nullable: true })
  creditor?: string

  @Field(() => String, { nullable: true })
  coPayerName?: string

  @Field(() => String, { nullable: true })
  coPayerNationalId?: string

  @Field(() => [Property], { nullable: true })
  properties?: Property[]

  @Field(() => [CoPayer], { nullable: true })
  coPayers?: CoPayer[]
}
