import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HmsLoansProperty')
export class Property {
  @Field(() => String, { nullable: true })
  propertyId?: string | null

  @Field(() => String, { nullable: true })
  propertyAddress?: string | null

  @Field(() => String, { nullable: true })
  propertyMunicipality?: string | null

  @Field(() => String, { nullable: true })
  epilog?: string | null

  @Field(() => String, { nullable: true })
  municipalityNumber?: string | null
}

@ObjectType('HmsLoansCoPayer')
export class CoPayer {
  @Field(() => String, { nullable: true })
  coPayerName?: string | null

  @Field(() => String, { nullable: true })
  coPayerNationalId?: string | null
}

@ObjectType('HmsLoansHistory')
export class LoanHistory {
  @Field(() => Number, { nullable: true })
  loanId?: number | null

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  homeAddress?: string | null

  @Field(() => Number, { nullable: true })
  postNumber?: number | null

  @Field(() => String, { nullable: true })
  municipality?: string | null

  @Field(() => Date, { nullable: true })
  firstInterestDate?: string | null

  @Field(() => Date, { nullable: true })
  firstPaymentDate?: string | null

  @Field(() => Number, { nullable: true })
  totalNumberOfPayments?: number | null

  @Field(() => Number, { nullable: true })
  numberOfPaymentPerYear?: number | null

  @Field(() => String, { nullable: true })
  balancePayment?: string | null

  @Field(() => String, { nullable: true })
  paymentFee?: string | null

  @Field(() => String, { nullable: true })
  paymentDelayment?: string | null

  @Field(() => String, { nullable: true })
  temporaryPaymentDelayment?: string | null

  @Field(() => String, { nullable: true })
  variableInterest?: string | null

  @Field(() => String, { nullable: true })
  affiliateLoan?: string | null

  @Field(() => String, { nullable: true })
  priceIndexType?: string | null

  @Field(() => Number, { nullable: true })
  baseIndex?: number | null

  @Field(() => Number, { nullable: true })
  interest?: number | null

  @Field(() => Number, { nullable: true })
  originalLoanAmount?: number | null

  @Field(() => Date, { nullable: true })
  nextPaymentDate?: string | null

  @Field(() => Date, { nullable: true })
  lastPaymentDate?: string | null

  @Field(() => Date, { nullable: true })
  lastUnpaidInvoiceDate?: string | null

  @Field(() => Number, { nullable: true })
  numberOfPaymentDatesRemaining?: number | null

  @Field(() => Number, { nullable: true })
  statusSettlementPayment?: number | null

  @Field(() => Number, { nullable: true })
  lastPaymentAmount?: number | null

  @Field(() => Number, { nullable: true })
  totalDueAmount?: number | null

  @Field(() => Number, { nullable: true })
  balanceWithoutInterestPriceImprovements?: number | null

  @Field(() => Number, { nullable: true })
  accruedInterestPriceImprovements?: number | null

  @Field(() => Number, { nullable: true })
  remainingBalanceWithoutDebt?: number | null

  @Field(() => Number, { nullable: true })
  repaymentFee?: number | null

  @Field(() => Number, { nullable: true })
  loanAmountWithRepayment?: number | null

  @Field(() => String, { nullable: true })
  loanStatus?: string | null

  @Field(() => String, { nullable: true })
  nationalId?: string | null

  @Field(() => String, { nullable: true })
  propertyId?: string | null

  @Field(() => String, { nullable: true })
  propertyAddress?: string | null

  @Field(() => String, { nullable: true })
  propertyMunicipality?: string | null

  @Field(() => String, { nullable: true })
  epilog?: string | null

  @Field(() => String, { nullable: true })
  municipalityNumber?: string | null

  @Field(() => String, { nullable: true })
  loanType?: string | null

  @Field(() => Number, { nullable: true })
  installments?: number | null

  @Field(() => String, { nullable: true })
  creditor?: string | null

  @Field(() => String, { nullable: true })
  coPayerName?: string | null

  @Field(() => String, { nullable: true })
  coPayerNationalId?: string | null

  @Field(() => [Property], { nullable: true })
  properties?: Property[] | null

  @Field(() => [CoPayer], { nullable: true })
  coPayers?: CoPayer[] | null
}
