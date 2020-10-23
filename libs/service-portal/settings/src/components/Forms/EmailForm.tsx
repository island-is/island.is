import React, { FC, useEffect } from 'react'
import { Box, Input } from '@island.is/island-ui/core'
import { useForm, Controller } from 'react-hook-form'

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
              message: 'Skylda er að fylla út netfang',
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Netfangið er ekki á réttu formi',
            },
          }}
          defaultValue={email}
          render={({ onChange, value, name }) => (
            <Input
              name={name}
              label="Netfang"
              value={value}
              hasError={errors.email}
              errorMessage={errors.email?.message}
              onChange={onChange}
            />
          )}
        />
      </Box>
      {(renderBackButton || renderSubmitButton) && (
        <Box display="flex" justifyContent="spaceBetween" marginTop={4}>
          {renderBackButton && renderBackButton()}
          {renderSubmitButton && renderSubmitButton()}
        </Box>
      )}
    </form>
  )
}
