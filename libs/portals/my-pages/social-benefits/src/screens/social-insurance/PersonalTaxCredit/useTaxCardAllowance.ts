import { MyTaxCreditState } from './PersonalTaxCredit'
import {
  useRegisterSocialInsuranceTaxCardAllowanceMutation,
  useUpdateSocialInsuranceTaxCardAllowanceMutation,
  useDiscontinueSocialInsuranceTaxCardAllowanceMutation,
} from './PersonalTaxCredit.generated'

export const useTaxCardAllowance = () => {
  const [register, { loading: registering }] =
    useRegisterSocialInsuranceTaxCardAllowanceMutation()
  const [update, { loading: updating }] =
    useUpdateSocialInsuranceTaxCardAllowanceMutation()
  const [discontinue, { loading: discontinuing }] =
    useDiscontinueSocialInsuranceTaxCardAllowanceMutation()

  const save = async (myTaxCredit: MyTaxCreditState) => {
    switch (myTaxCredit.action) {
      case 'register': {
        const { year, month, percentage } = myTaxCredit.data
        if (year == null || month == null) break
        await register({
          variables: { input: { year, month, percentage: Number(percentage) } },
        })
        break
      }
      case 'update':
        await update({
          variables: {
            input: {
              percentage: Number(myTaxCredit.data.percentage),
            },
          },
        })
        break
      case 'discontinue': {
        const { year, month } = myTaxCredit.data
        if (year == null || month == null) break
        await discontinue({
          variables: { input: { year, month } },
        })
        break
      }
    }
  }

  return {
    save,
    loading: registering || updating || discontinuing,
  }
}
