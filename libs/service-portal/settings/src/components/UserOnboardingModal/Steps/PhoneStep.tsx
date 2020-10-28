import React, { FC, useState } from 'react'
import { Button, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  PhoneForm,
  PhoneFormData,
  PhoneFormInternalStep,
} from '../../Forms/PhoneForm'

interface Props {
  tel: string
  natReg: string
  onBack: () => void
  onSubmit: (data: PhoneFormData) => void
}

export const PhoneStep: FC<Props> = ({ onBack, onSubmit, tel, natReg }) => {
  const { formatMessage } = useLocale()
  const [formState, setFormState] = useState<PhoneFormInternalStep>({
    tel,
    step: 'phone',
  })

  const phoneInputHeaderText = (
    <>
      <Text variant="h1" marginBottom={3}>
        {formatMessage({
          id: 'service.portal:tel-number',
          defaultMessage: 'Símanúmer',
        })}
      </Text>
      <Text marginBottom={7}>
        {formatMessage({
          id: 'sp.settings:profile-info-form-message',
          defaultMessage: `
                Vinsamlegast gerðu breytingar á þessum upplýsingum
                ef þörf krefur.
              `,
        })}
      </Text>
    </>
  )
  const codeConfirmationHeaderText = (
    <>
      <Text variant="h1" marginBottom={3}>
        {formatMessage({
          id: 'service.portal:tel-confirm-code',
          defaultMessage: 'Staðfestingakóði',
        })}
      </Text>
      <Text marginBottom={7}>
        {formatMessage({
          id: 'sp.settings:tel-confirm-form-message',
          defaultMessage: `
                Staðfestingarkóði hefur verið sendur á símanúmerið þitt: ${formState.tel}. 
                Skrifaðu kóðann inn hér að neðan.
              `,
        })}
      </Text>
    </>
  )

  return (
    <>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '4/7']}>
          {formState.step === 'phone'
            ? phoneInputHeaderText
            : codeConfirmationHeaderText}
        </GridColumn>
      </GridRow>
      <PhoneForm
        tel={tel}
        natReg={natReg}
        onInternalStateChange={(change) => setFormState(change)}
        renderBackButton={() => (
          <Button variant="ghost" onClick={onBack}>
            {formatMessage({
              id: 'service.portal:go-back',
              defaultMessage: 'Til baka',
            })}
          </Button>
        )}
        renderSubmitButton={() => (
          <Button variant="primary" type="submit" icon="arrowForward">
            {formState.step === 'phone'
              ? formatMessage({
                  id: 'service.portal:confirm-code',
                  defaultMessage: 'Senda staðfestingarkóða',
                })
              : formatMessage({
                  id: 'service.portal:next-step',
                  defaultMessage: 'Næsta skref',
                })}
          </Button>
        )}
        onSubmit={onSubmit}
      />
    </>
  )
}
