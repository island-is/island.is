import { MyTaxCreditState, SpouseTaxCreditState } from './PersonalTaxCredit'
import {
  useRegisterSocialInsuranceTaxCardAllowanceMutation,
  useUpdateSocialInsuranceTaxCardAllowanceMutation,
  useDiscontinueSocialInsuranceTaxCardAllowanceMutation,
  useSetSocialInsuranceSpouseTaxCardMutation,
  useSetSocialInsuranceSpouseTaxCardDueToDeathMutation,
} from './PersonalTaxCredit.generated'

export const useTaxCardAllowance = () => {
  const [register, { loading: registering }] =
    useRegisterSocialInsuranceTaxCardAllowanceMutation()
  const [update, { loading: updating }] =
    useUpdateSocialInsuranceTaxCardAllowanceMutation()
  const [discontinue, { loading: discontinuing }] =
    useDiscontinueSocialInsuranceTaxCardAllowanceMutation()
  const [setSpouse, { loading: settingSpouse }] =
    useSetSocialInsuranceSpouseTaxCardMutation()
  const [setSpouseDueToDeath, { loading: settingSpouseDueToDeath }] =
    useSetSocialInsuranceSpouseTaxCardDueToDeathMutation()

  const save = async (
    myTaxCredit: MyTaxCreditState,
    spouseTaxCredit: SpouseTaxCreditState,
  ) => {
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

    switch (spouseTaxCredit.action) {
      case 'grant': {
        const { year, month, percentage } = spouseTaxCredit.data
        if (year == null || month == null || !percentage) break
        await setSpouse({
          variables: { input: { year, month, percentage: Number(percentage) } },
        })
        break
      }
      case 'deceased': {
        const { year, month, percentage } = spouseTaxCredit.data
        if (year == null || month == null || !percentage) break
        await setSpouseDueToDeath({
          variables: { input: { year, month, percentage: Number(percentage) } },
        })
        break
      }
    }
  }

  return {
    save,
    loading:
      registering ||
      updating ||
      discontinuing ||
      settingSpouse ||
      settingSpouseDueToDeath,
  }
}
