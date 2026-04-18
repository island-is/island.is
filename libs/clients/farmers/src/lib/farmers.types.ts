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
): MappedBeneficiaryPaymentType => {
  const { paymentStop, operating, ...rest } = p
  return {
    ...rest,
    blocked:
      paymentStop !== undefined
        ? paymentStop.toLowerCase() === 'já'
        : undefined,
    operating:
      operating !== undefined
        ? operating.toLowerCase() === 'í rekstri'
        : undefined,
  }
}
