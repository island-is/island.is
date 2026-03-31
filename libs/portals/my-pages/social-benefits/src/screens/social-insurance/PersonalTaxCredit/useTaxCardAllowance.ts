import {
  useRegisterSocialInsuranceTaxCardAllowanceMutation,
  useUpdateSocialInsuranceTaxCardAllowanceMutation,
  useDiscontinueSocialInsuranceTaxCardAllowanceMutation,
} from './PersonalTaxCredit.generated'
import { MyTaxCreditState } from './types'

export const useTaxCardAllowance = () => {
  const [register, { loading: registering }] =
    useRegisterSocialInsuranceTaxCardAllowanceMutation()
  const [update, { loading: updating }] =
    useUpdateSocialInsuranceTaxCardAllowanceMutation()
  const [discontinue, { loading: discontinuing }] =
    useDiscontinueSocialInsuranceTaxCardAllowanceMutation()

  const save = async (myTaxCredit: MyTaxCreditState) => {
    switch (myTaxCredit.action) {
      case 'register':
        await register({
          variables: {
            input: {
              year: myTaxCredit.data.year ?? undefined,
              month: myTaxCredit.data.month ?? undefined,
              percentage: Number(myTaxCredit.data.percentage),
            },
          },
        })
        break
      case 'update':
        await update({
          variables: {
            input: {
              percentage: Number(myTaxCredit.data.percentage),
            },
          },
        })
        break
      case 'discontinue':
        await discontinue({
          variables: {
            input: {
              year: myTaxCredit.data.year ?? undefined,
              month: myTaxCredit.data.month ?? undefined,
            },
          },
        })
        break
    }
  }

  return {
    save,
    loading: registering || updating || discontinuing,
  }
}
