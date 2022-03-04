import React, { FC } from 'react'
import { Button, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
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
      <Text variant="h1" as="h1" marginBottom={3}>
        {formatMessage(m.email)}
      </Text>
      <Text variant="intro" marginBottom={7}>
        {formatMessage({
          id: 'sp.settings:email-form-message',
          defaultMessage: `
                Vinsamlegast settu inn nefangið þitt.
                Við komum til með að senda þér staðfestingar og tilkynningar.
              `,
        })}
      </Text>
      <EmailForm
        email={email}
        renderBackButton={() => (
          <Button variant="ghost" onClick={onBack}>
            {formatMessage(m.goBack)}
          </Button>
        )}
        renderSubmitButton={() => (
          <Button variant="primary" type="submit" icon="arrowForward">
            {formatMessage(m.nextStep)}
          </Button>
        )}
        onSubmit={onSubmit}
      />
    </>
  )
}
