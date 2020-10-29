import { toast } from '@island.is/island-ui/core'
import { useVerifySms } from '@island.is/service-portal/graphql'
import React, { FC, useEffect, useState } from 'react'
import { MessageDescriptor } from 'react-intl'
import {
  ConfirmationStep,
  PhoneConfirmationFormData,
} from './Steps/ConfirmationStep'
import { FormStep, PhoneFormData } from './Steps/FormStep'

export type PhoneFormInternalStep = 'form' | 'confirmation'

interface Props {
  tel: string
  natReg: string
  renderBackButton?: () => JSX.Element
  submitButtonText?: string | MessageDescriptor
  onInternalStepChange?: (step: PhoneFormInternalStep) => void
  onSubmit: (data: PhoneFormData) => void
}

export const PhoneForm: FC<Props> = ({
  tel,
  natReg,
  renderBackButton,
  submitButtonText,
  onInternalStepChange,
  onSubmit,
}) => {
  const {
    createSmsVerification,
    confirmSmsVerification,
    createLoading,
    confirmLoading,
  } = useVerifySms(natReg)
  const [step, setStep] = useState<PhoneFormInternalStep>('form')
  const [telInternal, setTelInternal] = useState<string>(tel)

  useEffect(() => setTelInternal(tel), [tel])

  const gotoStep = (step: PhoneFormInternalStep) => {
    setStep(step)
    if (onInternalStepChange) onInternalStepChange(step)
  }

  const handleFormStepSubmit = async (data: PhoneFormData) => {
    try {
      const response = await createSmsVerification({
        mobilePhoneNumber: data.tel,
      })

      if (response.data?.createSmsVerification?.created) {
        gotoStep('confirmation')
        setTelInternal(data.tel)
      } else {
        toast.error(
          'Eitthvað fór úrskeiðis, ekki tókst að senda SMS í þetta símanúmer',
        )
      }
    } catch (err) {
      toast.error(
        'Eitthvað fór úrskeiðis, ekki tókst að senda SMS í þetta símanúmer',
      )
    }
  }

  const handleConfirmationStepSubmit = async (
    data: PhoneConfirmationFormData,
  ) => {
    try {
      const response = await confirmSmsVerification({
        code: data.code,
      })
      if (response.data?.confirmSmsVerification?.confirmed) {
        onSubmit({
          tel: data.tel,
        })
      } else {
        toast.error('Eitthvað fór úrskeiðis, kóði var ekki réttur')
      }
    } catch (err) {
      toast.error('Eitthvað fór úrskeiðis, ekki tókst að staðfesta kóða')
    }
  }

  return (
    <>
      {step === 'form' && (
        <FormStep
          tel={tel}
          renderBackButton={renderBackButton}
          onSubmit={handleFormStepSubmit}
          loading={createLoading}
        />
      )}
      {step === 'confirmation' && (
        <ConfirmationStep
          tel={telInternal}
          submitButtonText={submitButtonText}
          onSubmit={handleConfirmationStepSubmit}
          onBack={gotoStep.bind(null, 'form')}
          loading={confirmLoading}
        />
      )}
    </>
  )
}
