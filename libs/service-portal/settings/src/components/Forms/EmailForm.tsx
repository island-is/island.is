import React, { FC, useEffect } from 'react'
import { Box, Input } from '@island.is/island-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'

export interface EmailFormData {
  email: string
}

interface Props {
  email: string
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
  onSubmit: (data: EmailFormData) => void
}

export const EmailForm: FC<Props> = ({
  email,
  renderBackButton,
  renderSubmitButton,
  onSubmit,
}) => {
  const { formatMessage } = useLocale()
  const { handleSubmit, control, errors, reset } = useForm()

  useEffect(() => {
    if (email.length > 0)
      reset({
        email,
      })
  }, [email])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Controller
          control={control}
          name="email"
          rules={{
            required: {
              value: true,
              message: formatMessage({
                id: 'sp.settings:email-required-message',
                defaultMessage: 'Skylda er að fylla út netfang',
              }),
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: formatMessage({
                id: 'sp.settings:email-wrong-format-message',
                defaultMessage: 'Netfangið er ekki á réttu formi',
              }),
            },
          }}
          defaultValue={email}
          render={({ onChange, value, name }) => (
            <Input
              name={name}
              label={formatMessage({
                id: 'global:email',
                defaultMessage: 'Netfang',
              })}
              placeholder={formatMessage({
                id: 'global:email',
                defaultMessage: 'Netfang',
              })}
              value={value}
              hasError={errors.email}
              errorMessage={errors.email?.message}
              onChange={onChange}
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
