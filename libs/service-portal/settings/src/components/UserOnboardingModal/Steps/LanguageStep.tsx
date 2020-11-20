import React, { FC } from 'react'
import { Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  LanguageForm,
  LanguageFormData,
  LanguageFormOption,
} from '../../Forms/LanguageForm'
import { User } from 'oidc-client'

interface Props {
  language: LanguageFormOption | null
  onClose: () => void
  onSubmit: (data: LanguageFormData) => void
  userInfo: User
}

export const LanguageStep: FC<Props> = ({
  onClose,
  onSubmit,
  language,
  userInfo,
}) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Text variant="h1" marginBottom={3}>
        {formatMessage({
          id: 'service.portal:hi',
          defaultMessage: 'Hæ',
        })}
        {`, ${userInfo?.profile.name}`}
      </Text>
      <Text variant="intro" marginBottom={7}>
        {formatMessage({
          id: 'sp.settings:language-step-onboarding',
          defaultMessage: `
            Byrjum á því að velja það tungumál sem hentar þér.
            Let's begin by picking the language of your choice.
          `,
        })}
      </Text>
      <LanguageForm
        language={language}
        renderBackButton={() => (
          <Button variant="ghost" onClick={onClose}>
            {formatMessage({
              id: 'sp.settings:finish-later',
              defaultMessage: 'Klára seinna',
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
