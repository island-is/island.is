import { Field, Int, Float, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsInvoice')
export class Invoice {
  @Field(() => Int)
  invoiceSK!: number

  @Field(() => Int)
  erpInvoiceId!: number

  @Field(() => Int)
  sourceErpId!: number

  @Field()
  invoiceNum!: string

  @Field()
  invoiceCurrencyCode!: string

  @Field(() => Float)
  erpInvoiceAmount!: number

  @Field(() => Float)
  erpInvoiceAmountISK!: number

  @Field(() => Float)
  eInvoiceTaxInclusiveAmount!: number

  @Field(() => Float)
  eInvoiceTaxExclusiveAmount!: number

  @Field(() => Float)
  amountPaid!: number

  @Field(() => Float, { nullable: true })
  exchangeRate?: number

  @Field({ nullable: true })
  exchangeRateType?: string

  @Field()
  apInvoicePaymentStatusFlag!: string

  @Field()
  apInvoiceGlDate!: string

  @Field()
  firstInvoicePaymentAccountingDate!: string

  @Field()
  lastInvoicePaymentAccountingDate!: string

  @Field()
  invoiceIsConfidential!: boolean

  @Field()
  datamartUpdateDate!: string

  @Field({ nullable: true })
  datamartUpdateProcessId?: string

  @Field(() => Int)
  customerId!: number

  @Field()
  customerName!: string

  @Field()
  customerLegalId!: string

  @Field({ nullable: true })
  customerLegalIdScheme?: string

  @Field(() => Int)
  supplierId!: number

  @Field()
  supplierName!: string

  @Field()
  supplierLegalId!: string

  @Field({ nullable: true })
  supplierLegalIdScheme?: string

  @Field()
  supplierIsPrivatePersonProxy!: boolean

  @Field()
  supplierIsConfidential!: boolean

  @Field(() => Int)
  paymentMethodId!: number

  @Field()
  paymentMethodCode!: string

  @Field()
  paymentMethodMeaning_ISL!: string

  @Field()
  paymentMethodDescription_ISL!: string

  @Field()
  paymentMethodMeaning_ENG!: string

  @Field()
  paymentMethodDescription_ENG!: string

  @Field(() => Int)
  invoiceSourceId!: number

  @Field()
  invoiceSourceCode!: string

  @Field()
  invoiceSourceMeaning_ISL!: string

  @Field()
  invoiceSourceDescription_ISL!: string

  @Field()
  invoiceSourceMeaning_ENG!: string

  @Field()
  invoiceSourceDescription_ENG!: string

  @Field(() => Int)
  invoiceTypeId!: number

  @Field()
  invoiceTypeCode!: string

  @Field()
  invoiceTypeMeaning_ISL!: string

  @Field()
  invoiceTypeDescription_ISL!: string

  @Field()
  invoiceTypeMeaning_ENG!: string

  @Field()
  invoiceTypeDescription_ENG!: string
}