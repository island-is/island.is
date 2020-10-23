import React, { FC } from 'react'
import { Button, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  LanguageForm,
  LanguageFormData,
  LanguageFormOption,
} from '../../Forms/LanguageForm'

interface Props {
  language: LanguageFormOption | null
  onBack: () => void
  onSubmit: (data: LanguageFormData) => void
}

export const LanguageStep: FC<Props> = ({ onBack, onSubmit, language }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '4/7']}>
          <Text variant="h1" marginBottom={3}>
            {formatMessage({
              id: 'service.portal:language',
              defaultMessage: 'Tungumál',
            })}
          </Text>
          <Text marginBottom={7}>
            {formatMessage({
              id: 'sp.settings:language-form-message',
              defaultMessage: `
                Vinsamlegast veldu tungumálið sem þú vilt
                nota í kerfum island.is
              `,
            })}
          </Text>
        </GridColumn>
      </GridRow>
      <LanguageForm
        language={language}
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
              id: 'service.portal:save-data',
              defaultMessage: 'Vista upplýsingar',
            })}
          </Button>
        )}
        onSubmit={onSubmit}
      />
    </>
  )
}
