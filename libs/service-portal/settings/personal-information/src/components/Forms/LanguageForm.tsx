import React, { FC } from 'react'
import { Select, Option } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Controller } from 'react-hook-form'
import { Locale } from '@island.is/shared/types'
import { HookFormType } from '../Forms/ProfileForm/types/form'
import { m } from '@island.is/service-portal/core'

export type LanguageFormOption = {
  label: 'Íslenska' | 'English'
  value: Locale
}

interface Props {
  hookFormData: HookFormType
}

const languageOptions = [
  { label: 'Íslenska', value: 'is' },
  { label: 'English', value: 'en' },
]

export const LanguageForm: FC<Props> = ({ hookFormData }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const { control } = hookFormData

  return (
    <Controller
      name="language"
      control={control}
      render={({ onChange, value }) => {
        return (
          <Select
            name="language"
            size="xs"
            value={languageOptions.find((option) => option.value === value)}
            onChange={(newVal) => {
              onChange((newVal as Option).value)
            }}
            label={formatMessage(m.language)}
            options={languageOptions}
          />
        )
      }}
    />
  )
}
