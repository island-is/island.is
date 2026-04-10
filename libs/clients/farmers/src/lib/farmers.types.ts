import { BeneficiaryWrapper, BeneficiaryPaymentType } from '../../gen/fetch'

export type MappedBeneficiaryPaymentType = Omit<
  BeneficiaryPaymentType,
  'paymentStop' | 'operating'
> & {
  blocked?: boolean
  operating?: boolean
}

export type MappedBeneficiaryWrapper = Omit<BeneficiaryWrapper, 'list'> & {
  list?: MappedBeneficiaryPaymentType[]
}

export const mapBeneficiaryPayment = (
  p: BeneficiaryPaymentType,
): MappedBeneficiaryPaymentType => ({
  ...p,
  blocked:
    p.paymentStop !== undefined
      ? p.paymentStop.toLowerCase() === 'já'
      : undefined,
  operating:
    p.operating !== undefined
      ? p.operating.toLowerCase() === 'í rekstri'
      : undefined,
})
