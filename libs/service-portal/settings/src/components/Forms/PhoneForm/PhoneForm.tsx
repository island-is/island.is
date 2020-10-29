import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useVerifySms } from '@island.is/service-portal/graphql'
import React, { FC, useEffect, useState } from 'react'
import { defineMessage, MessageDescriptor } from 'react-intl'
import {
  ConfirmationStep,
  PhoneConfirmationFormData,
} from './Steps/ConfirmationStep'
import { FormStep, PhoneFormData } from './Steps/FormStep'
import {
  codeErrorMessage,
  smsErrorMessage,
  wrongCodeErrorMessage,
} from './utils'

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
  const { formatMessage } = useLocale()
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
        toast.error(formatMessage(smsErrorMessage))
      }
    } catch (err) {
      toast.error(formatMessage(smsErrorMessage))
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
        toast.error(formatMessage(wrongCodeErrorMessage))
      }
    } catch (err) {
      toast.error(formatMessage(codeErrorMessage))
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
