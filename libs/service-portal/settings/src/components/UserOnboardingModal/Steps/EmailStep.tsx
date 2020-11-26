import React, { FC } from 'react'
import { Button, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { EmailForm, EmailFormData } from '../../Forms/EmailForm'

interface Props {
  email: string
  onBack: () => void
  onSubmit: (data: EmailFormData) => void
}

export const EmailStep: FC<Props> = ({ onBack, onSubmit, email }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Text variant="h1" marginBottom={3}>
        {formatMessage({
          id: 'service.portal:email',
          defaultMessage: 'Netfang',
        })}
      </Text>
      <Text marginBottom={7}>
        {formatMessage({
          id: 'sp.settings:email-form-message',
          defaultMessage: `
                Vinsamlegt settu inn nefangið þitt.
                Við komum til með að senda á þig staðfestingar og tilkynningar.
              `,
        })}
      </Text>
      <EmailForm
        email={email}
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
            {formatMessage({
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
