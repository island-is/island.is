import { Box, Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { m } from '@island.is/service-portal/core'
import React, { FC, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

export type LanguageFormOption = {
  label: 'Íslenska' | 'English'
  value: Locale
}

export interface LanguageFormData {
  language: LanguageFormOption | null
}

interface Props {
  language: LanguageFormOption | null
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
  onValueChange?: (data: LanguageFormData) => void
  onSubmit: (data: LanguageFormData) => void
}

export const LanguageForm: FC<Props> = ({
  language,
  renderBackButton,
  renderSubmitButton,
  onValueChange,
  onSubmit,
}) => {
  const { handleSubmit, control, reset } = useForm()
  const { formatMessage } = useLocale()

  useEffect(() => {
    if (language)
      reset({
        language,
      })
  }, [language])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Controller
          control={control}
          name="language"
          defaultValue={language || { label: 'Íslenska', value: 'is' }}
          render={({ onChange, value, name }) => (
            <Select
              size="xs"
              name={name}
              value={value}
              onChange={(value, actionMeta) => {
                onChange(value, actionMeta)
                if (onValueChange)
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
          )}
        />
      </Box>
      {(renderBackButton || renderSubmitButton) && (
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          flexDirection={['columnReverse', 'row']}
          marginTop={4}
        >
          {renderBackButton && (
            <Box marginTop={[1, 0]}>{renderBackButton()}</Box>
          )}
          {renderSubmitButton && <Box>{renderSubmitButton()}</Box>}
        </Box>
      )}
    </form>
  )
}
