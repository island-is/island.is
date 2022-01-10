import React, { FC, useState } from 'react'
import { Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { EmailForm, FormInternalStep } from '../../Forms/EmailForm/EmailForm'
import { EmailFormData } from '../../Forms/EmailForm/Steps/FormStep'

interface Props {
  email: string
  natReg: string
  onBack: () => void
  onSkip?: () => void
  onSubmit: (data: EmailFormData) => void
}

export const EmailStep: FC<Props> = ({
  onBack,
  onSubmit,
  onSkip,
  email,
  natReg,
}) => {
  const { formatMessage } = useLocale()
  const [step, setStep] = useState<FormInternalStep>('form')

  const handleFormInternalStepChange = (value: FormInternalStep) =>
    setStep(value)

  return (
    <>
      <Text variant="h1" as="h1" marginBottom={3}>
        {step === 'form'
          ? formatMessage(m.telNumber)
          : formatMessage(m.telConfirmCode)}
      </Text>
      <Text variant="intro" marginBottom={7}>
        {step === 'form'
          ? formatMessage({
              id: 'sp.settings:email-form-message',
              defaultMessage: `
                  Vinsamlegast settu inn nefangið þitt.
                  Við komum til með að senda þér staðfestingar og tilkynningar.
                `,
            })
          : formatMessage({
              id: 'sp.settings:email-confirm-form-message',
              defaultMessage: `
                  Staðfestingarkóði hefur verið sendur á tölvupóstinn þitt.
                  Skrifaðu kóðann inn hér að neðan.
                `,
            })}
      </Text>
      <EmailForm
        email={email}
        natReg={natReg}
        onInternalStepChange={handleFormInternalStepChange}
        renderBackButton={() => (
          <Button variant="ghost" onClick={onBack}>
            {formatMessage(m.goBack)}
          </Button>
        )}
        submitButtonText={formatMessage({
          id: 'sp.settings:save-changes',
          defaultMessage: 'Vista breytingar',
        })}
        onSkip={onSkip}
        onSubmit={onSubmit}
      />
    </>
  )
}
