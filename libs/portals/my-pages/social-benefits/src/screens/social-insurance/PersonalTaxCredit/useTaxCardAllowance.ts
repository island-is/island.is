import { PersonalFormValues, SpouseFormValues } from './taxCreditFormUtils'
import {
  useRegisterSocialInsuranceTaxCardAllowanceMutation,
  useUpdateSocialInsuranceTaxCardAllowanceMutation,
  useDiscontinueSocialInsuranceTaxCardAllowanceMutation,
  useSetSocialInsuranceSpouseTaxCardMutation,
  useSetSocialInsuranceSpouseTaxCardDueToDeathMutation,
} from './PersonalTaxCredit.generated'

export interface TaxCardSaveResult {
  myError: boolean
  spouseError: boolean
}

export const useTaxCardAllowance = () => {
  const refetchOptions = {
    refetchQueries: ['getPersonalTaxCredit'],
    awaitRefetchQueries: true,
  }

  const [register, { loading: registering }] =
    useRegisterSocialInsuranceTaxCardAllowanceMutation(refetchOptions)
  const [update, { loading: updating }] =
    useUpdateSocialInsuranceTaxCardAllowanceMutation(refetchOptions)
  const [discontinue, { loading: discontinuing }] =
    useDiscontinueSocialInsuranceTaxCardAllowanceMutation(refetchOptions)
  const [setSpouse, { loading: settingSpouse }] =
    useSetSocialInsuranceSpouseTaxCardMutation(refetchOptions)
  const [setSpouseDueToDeath, { loading: settingSpouseDueToDeath }] =
    useSetSocialInsuranceSpouseTaxCardDueToDeathMutation(refetchOptions)

  const save = async (
    myTaxCredit: PersonalFormValues,
    spouseTaxCredit: SpouseFormValues,
  ): Promise<TaxCardSaveResult> => {
    let myError = false
    let spouseError = false

    switch (myTaxCredit.action) {
      case 'register': {
        const { year, month, percentage } = myTaxCredit
        if (year == null || month == null || !percentage) break
        try {
          const res = await register({
            variables: {
              input: { year, month, percentage: Number(percentage) },
            },
          })
          if (!res.data?.registerSocialInsuranceTaxCardAllowance) myError = true
        } catch {
          myError = true
        }
        break
      }
      case 'update': {
        if (!myTaxCredit.percentage) break
        try {
          const res = await update({
            variables: {
              input: { percentage: Number(myTaxCredit.percentage) },
            },
          })
          if (!res.data?.updateSocialInsuranceTaxCardAllowance) myError = true
        } catch {
          myError = true
        }
        break
      }
      case 'discontinue': {
        const { year, month } = myTaxCredit
        if (year == null || month == null) break
        try {
          const res = await discontinue({
            variables: { input: { year, month } },
          })
          if (!res.data?.discontinueSocialInsuranceTaxCardAllowance)
            myError = true
        } catch {
          myError = true
        }
        break
      }
    }

    switch (spouseTaxCredit.action) {
      case 'grant': {
        const { year, month, percentage } = spouseTaxCredit
        if (year == null || month == null || !percentage) break
        try {
          const res = await setSpouse({
            variables: {
              input: { year, month, percentage: Number(percentage) },
            },
          })
          if (!res.data?.setSocialInsuranceSpouseTaxCard) spouseError = true
        } catch {
          spouseError = true
        }
        break
      }
      case 'deceased': {
        const { year, month, percentage } = spouseTaxCredit
        if (year == null || month == null || !percentage) break
        try {
          const res = await setSpouseDueToDeath({
            variables: {
              input: { year, month, percentage: Number(percentage) },
            },
          })
          if (!res.data?.setSocialInsuranceSpouseTaxCardDueToDeath)
            spouseError = true
        } catch {
          spouseError = true
        }
        break
      }
    }

    return { myError, spouseError }
  }

  return {
    save,
    myLoading: registering || updating || discontinuing,
    spouseLoading: settingSpouse || settingSpouseDueToDeath,
    loading:
      registering ||
      updating ||
      discontinuing ||
      settingSpouse ||
      settingSpouseDueToDeath,
  }
}
