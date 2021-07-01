import React, { FC, useState } from 'react'
import { Button, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import {
  PhoneForm,
  PhoneFormInternalStep,
} from '../../Forms/PhoneForm/PhoneForm'
import { PhoneFormData } from '../../Forms/PhoneForm/Steps/FormStep'

interface Props {
  tel: string
  natReg: string
  onBack: () => void
  onSubmit: (data: PhoneFormData) => void
}

export const PhoneStep: FC<Props> = ({ onBack, onSubmit, tel, natReg }) => {
  const { formatMessage } = useLocale()
  const [step, setStep] = useState<PhoneFormInternalStep>('form')

  const handleFormInternalStepChange = (value: PhoneFormInternalStep) =>
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
              id: 'sp.settings:onboarding-phone-form-message',
              defaultMessage: `
                  Vinsamlegast sláðu inn símanúmerið þitt
                `,
            })
          : formatMessage({
              id: 'sp.settings:tel-confirm-form-message',
              defaultMessage: `
                  Staðfestingarkóði hefur verið sendur á símanúmerið þitt.
                  Skrifaðu kóðann inn hér að neðan.
                `,
            })}
      </Text>
      <PhoneForm
        tel={tel}
        natReg={natReg}
        onInternalStepChange={handleFormInternalStepChange}
        renderBackButton={() => (
          <Button variant="ghost" onClick={onBack}>
            {formatMessage(m.goBack)}
          </Button>
        )}
        submitButtonText={m.nextStep}
        onSubmit={onSubmit}
      />
    </>
  )
}
