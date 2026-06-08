import { useForm } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { toast } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { useTaxCardAllowance } from './useTaxCardAllowance'
import {
  PersonalFormValues,
  SpouseFormValues,
  PERSONAL_FORM_DEFAULTS,
  SPOUSE_FORM_DEFAULTS,
} from './taxCreditFormUtils'

export const usePersonalTaxCreditForm = () => {
  const { formatMessage } = useLocale()
  const taxCardAllowance = useTaxCardAllowance()

  const personalForm = useForm<PersonalFormValues>({
    defaultValues: PERSONAL_FORM_DEFAULTS,
    mode: 'onChange',
    shouldUnregister: true,
  })

  const spouseForm = useForm<SpouseFormValues>({
    defaultValues: SPOUSE_FORM_DEFAULTS,
    mode: 'onChange',
    shouldUnregister: true,
  })

  // Edit mode — personal tax credit only (inline table row)
  const handleCancelPersonal = () => personalForm.reset()

  const handleSavePersonal = async (): Promise<boolean> => {
    const isValid = await personalForm.trigger()
    if (!isValid) return false

    personalForm.clearErrors('root')
    const { myError } = await taxCardAllowance.save(
      personalForm.getValues(),
      SPOUSE_FORM_DEFAULTS,
    )

    if (myError) {
      personalForm.setError('root', {
        message: formatMessage(m.personalTaxCreditSaveError),
      })
      return false
    }

    personalForm.reset()
    toast.success(formatMessage(m.personalTaxCreditSaveSuccess))
    return true
  }

  // Edit mode — spouse only (bottom buttons in spouse section)
  const handleCancelSpouse = () => {
    spouseForm.reset()
  }

  const handleSaveSpouse = async (): Promise<boolean> => {
    const isValid = await spouseForm.trigger()
    if (!isValid) return false

    spouseForm.clearErrors('root')
    const { spouseError } = await taxCardAllowance.save(
      PERSONAL_FORM_DEFAULTS,
      spouseForm.getValues(),
    )

    if (spouseError) {
      spouseForm.setError('root', {
        message: formatMessage(m.spouseTaxCreditUnknownError),
      })
      return false
    }

    spouseForm.reset()
    toast.success(formatMessage(m.personalTaxCreditSaveSuccess))
    return true
  }

  // First time — both together (single bottom buttons)
  const handleCancelAll = () => {
    personalForm.reset()
    spouseForm.reset()
  }

  const handleSaveAll = async (): Promise<boolean> => {
    const [personalValid, spouseValid] = await Promise.all([
      personalForm.trigger(),
      spouseForm.trigger(),
    ])

    if (!personalValid || !spouseValid) return false

    const personalData = personalForm.getValues()
    const spouseData = spouseForm.getValues()

    if (personalData.action === null && spouseData.action === null) return false

    personalForm.clearErrors('root')
    spouseForm.clearErrors('root')

    const { myError, spouseError } = await taxCardAllowance.save(
      personalData,
      spouseData,
    )

    if (myError) {
      personalForm.setError('root', {
        message: formatMessage(m.personalTaxCreditSaveError),
      })
    }
    if (spouseError) {
      spouseForm.setError('root', {
        message: formatMessage(m.spouseTaxCreditUnknownError),
      })
    }
    if (myError || spouseError) return false

    personalForm.reset()
    spouseForm.reset()
    toast.success(formatMessage(m.personalTaxCreditSaveSuccess))
    return true
  }

  const personalAction = personalForm.watch('action')
  const spouseAction = spouseForm.watch('action')

  return {
    personalForm,
    spouseForm,
    spouseAction,

    handleCancelPersonal,
    handleSavePersonal,
    savingPersonal: taxCardAllowance.myLoading,
    canSubmitPersonal:
      personalAction !== null && personalForm.formState.isValid,

    handleCancelSpouse,
    handleSaveSpouse,
    savingSpouse: taxCardAllowance.spouseLoading,
    canSubmitSpouse: spouseAction !== null && spouseForm.formState.isValid,

    handleCancelAll,
    handleSaveAll,
    savingAll: taxCardAllowance.loading,
    canSubmitAll:
      (personalAction !== null || spouseAction !== null) &&
      personalForm.formState.isValid &&
      spouseForm.formState.isValid,
  }
}
