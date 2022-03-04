import React, { FC } from 'react'
import { Button, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
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
  const { changeLanguage } = useNamespaces()

  const handleValueChange = (data: LanguageFormData) =>
    data.language?.value && changeLanguage(data.language.value)

  return (
    <>
      <Text variant="h1" as="h1" marginBottom={3}>
        {formatMessage(m.hi)}
        {`, ${userInfo?.profile.name}`}
      </Text>
      <Text variant="intro" marginBottom={7}>
        {formatMessage({
          id: 'sp.settings:language-step-onboarding',
          defaultMessage: `
            Byrjum á því að velja það tungumál sem hentar þér.
          `,
        })}
      </Text>
      <LanguageForm
        language={language}
        onValueChange={handleValueChange}
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
            {formatMessage(m.nextStep)}
          </Button>
        )}
        onSubmit={onSubmit}
      />
    </>
  )
}
