import { Box, Select } from '@island.is/island-ui/core'
import { Locale } from '@island.is/localization'
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
  onSubmit: (data: LanguageFormData) => void
}

export const LanguageForm: FC<Props> = ({
  language,
  renderBackButton,
  renderSubmitButton,
  onSubmit,
}) => {
  const { handleSubmit, control, reset } = useForm()

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
          defaultValue={language}
          render={({ onChange, value, name }) => (
            <Select
              name={name}
              value={value}
              onChange={onChange}
              label="Tungumál"
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
          flexWrap="wrap"
          marginTop={4}
        >
          {renderBackButton && (
            <Box marginBottom={[1, 0]}>{renderBackButton()}</Box>
          )}
          {renderSubmitButton && (
            <Box marginBottom={[1, 0]}>{renderSubmitButton()}</Box>
          )}
        </Box>
      )}
    </form>
  )
}
