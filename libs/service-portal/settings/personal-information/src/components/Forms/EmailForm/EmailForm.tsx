import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC, useEffect, useState } from 'react'
import { MessageDescriptor } from 'react-intl'
import {
  ConfirmationStep,
  EmailConfirmationFormData,
} from './Steps/ConfirmationStep'
import { FormStep, EmailFormData } from './Steps/FormStep'
import { useVerifyEmail } from '@island.is/service-portal/graphql'
import { useResendEmailVerification } from '@island.is/service-portal/graphql'

export type FormInternalStep = 'form' | 'confirmation'

interface Props {
  email: string
  natReg: string
  renderBackButton?: () => JSX.Element
  submitButtonText?: string | MessageDescriptor
  onInternalStepChange?: (step: FormInternalStep) => void
  onSubmit: (data: EmailFormData) => void
  onSkip?: () => void
}

export const EmailForm: FC<Props> = ({
  email,
  renderBackButton,
  submitButtonText,
  onInternalStepChange,
  onSubmit,
  onSkip,
}) => {
  const { formatMessage } = useLocale()
  const {
    resendEmailVerification,
    loading: createLoading,
  } = useResendEmailVerification()
  const { confirmEmailVerification, loading } = useVerifyEmail()
  const [step, setStep] = useState<FormInternalStep>('form')
  const [emailInternal, setEmailInternal] = useState<string>(email)

  useEffect(() => setEmailInternal(email), [email])

  const gotoStep = (step: FormInternalStep) => {
    setStep(step)
    if (onInternalStepChange) onInternalStepChange(step)
  }

  const handleFormStepSubmit = async (data: EmailFormData) => {
    try {
      const response = await resendEmailVerification()

      if (response.data?.resendEmailVerification?.created) {
        toast.success(
          formatMessage({
            id: 'sp.settings:email-confirm-form-message-toast',
            defaultMessage: `
              Staðfestingarkóði hefur verið sendur á tölvupóstfangið þitt.`,
          }),
        )
        gotoStep('confirmation')
        setEmailInternal(data.email)
      } else {
        toast.error(
          formatMessage({
            id: 'sp.settings:email-error-message',
            defaultMessage:
              'Eitthvað fór úrskeiðis, ekki tókst að senda tölvupóst á þetta tölvupóstfang',
          }),
        )
      }
    } catch (err) {
      toast.error(
        formatMessage({
          id: 'sp.settings:email-error-message',
          defaultMessage:
            'Eitthvað fór úrskeiðis, ekki tókst að senda tölvupóst á þetta tölvupóstfang',
        }),
      )
    }
  }

  const handleConfirmationStepSubmit = async (
    data: EmailConfirmationFormData,
  ) => {
    try {
      const response = await confirmEmailVerification({
        hash: data.code,
      })
      if (response.data?.confirmEmailVerification?.confirmed) {
        onSubmit({
          email: data.email,
        })
      } else {
        toast.error(
          formatMessage({
            id: 'sp.settings:wrong-code-message',
            defaultMessage: 'Eitthvað fór úrskeiðis, kóði var ekki réttur',
          }),
        )
      }
    } catch (err) {
      toast.error(
        formatMessage({
          id: 'sp.settings:code-error-message',
          defaultMessage: 'Eitthvað fór úrskeiðis, kóði var ekki réttur',
        }),
      )
    }
  }

  return (
    <>
      {step === 'form' && (
        <FormStep
          email={email}
          renderBackButton={renderBackButton}
          onSubmit={handleFormStepSubmit}
          onSkip={onSkip}
          loading={createLoading}
        />
      )}
      {step === 'confirmation' && (
        <ConfirmationStep
          email={emailInternal}
          submitButtonText={submitButtonText}
          onSubmit={handleConfirmationStepSubmit}
          onBack={gotoStep.bind(null, 'form')}
          loading={loading}
        />
      )}
    </>
  )
}
