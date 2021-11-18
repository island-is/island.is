import React, { FC } from 'react'
import { Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { SimplePhoneForm } from './PhoneForm'
import { PhoneFormData } from '../../Forms/PhoneForm/Steps/FormStep'

interface Props {
  tel: string
  natReg: string
  onBack: () => void
  onSubmit: (data: PhoneFormData) => void
}

export const PhoneStep: FC<Props> = ({ onBack, onSubmit, tel }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Text variant="h1" as="h1" marginBottom={3}>
        {formatMessage(m.telNumber)}
      </Text>
      <Text variant="intro" marginBottom={7}>
        {formatMessage({
          id: 'sp.settings:onboarding-phone-form-message',
          defaultMessage: `
                  Vinsamlegast sláðu inn símanúmerið þitt
                `,
        })}
      </Text>
      <SimplePhoneForm
        tel={tel}
        renderBackButton={() => (
          <Button variant="ghost" onClick={onBack}>
            {formatMessage(m.goBack)}
          </Button>
        )}
        renderSubmitButton={() => (
          <Button type="submit" variant="primary" icon="arrowForward">
            {formatMessage({
              id: 'sp.settings:save-changes',
              defaultMessage: 'Vista breytingar',
            })}
          </Button>
        )}
        onSubmit={onSubmit}
      />
    </>
  )
}
