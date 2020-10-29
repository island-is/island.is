import React, { FC, useState } from 'react'
import { Button, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  PhoneForm,
  PhoneFormInternalStep,
} from '../../Forms/PhoneForm/PhoneForm'
import { PhoneFormData } from '../../Forms/PhoneForm/Steps/FormStep'
import { defineMessage } from 'react-intl'

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
      <GridRow>
        <GridColumn span={['1/1', '1/1', '4/7']}>
          <Text variant="h1" marginBottom={3}>
            {step === 'form'
              ? formatMessage({
                  id: 'service.portal:tel-number',
                  defaultMessage: 'Símanúmer',
                })
              : formatMessage({
                  id: 'service.portal:tel-confirm-code',
                  defaultMessage: 'Staðfestingarkóði',
                })}
          </Text>
          <Text marginBottom={7}>
            {step === 'form'
              ? formatMessage({
                  id: 'sp.settings:profile-info-form-message',
                  defaultMessage: `
                  Vinsamlegast gerðu breytingar á þessum upplýsingum
                  ef þörf krefur.
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
        </GridColumn>
      </GridRow>
      <PhoneForm
        tel={tel}
        natReg={natReg}
        onInternalStepChange={handleFormInternalStepChange}
        renderBackButton={() => (
          <Button variant="ghost" onClick={onBack}>
            {formatMessage({
              id: 'service.portal:go-back',
              defaultMessage: 'Til baka',
            })}
          </Button>
        )}
        submitButtonText={defineMessage({
          id: 'service.portal:next-step',
          defaultMessage: 'Næsta skref',
        })}
        onSubmit={onSubmit}
      />
    </>
  )
}
