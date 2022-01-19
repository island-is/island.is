import { Select } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { m } from '@island.is/service-portal/core'
import React, { FC } from 'react'

export type LanguageFormOption = {
  label: 'Íslenska' | 'English'
  value: Locale
}

export interface LanguageFormData {
  language: LanguageFormOption | null
}

interface Props {
  language: LanguageFormOption | null
  onValueChange: (data: LanguageFormData) => void
}

export const LanguageForm: FC<Props> = ({ language, onValueChange }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()

  return (
    <Select
      name="language-select"
      size="xs"
      value={language}
      onChange={(value) => {
        onValueChange({
          language: value as LanguageFormOption,
        })
      }}
      label={formatMessage(m.language)}
      options={[
        { label: 'Íslenska', value: 'is' },
        { label: 'English', value: 'en' },
      ]}
    />
  )
}
