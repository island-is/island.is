import { Box, Input } from '@island.is/island-ui/core'
import React, { FC, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

export interface PhoneFormData {
  tel: string
}

interface Props {
  tel: string
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
  onSubmit: (data: PhoneFormData) => void
}

export const PhoneForm: FC<Props> = ({
  tel,
  renderBackButton,
  renderSubmitButton,
  onSubmit,
}) => {
  const { handleSubmit, control, errors, reset } = useForm()

  useEffect(() => {
    if (tel.length > 0)
      reset({
        tel,
      })
  }, [tel])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Controller
          control={control}
          name="tel"
          rules={{
            required: {
              value: true,
              message: 'Skylda er að fylla út símanúmer',
            },
            minLength: {
              value: 7,
              message: 'Símanúmer þarf að vera minnst 7 tölustafir á lengd',
            },
            pattern: {
              value: /^\d+$/,
              message: 'Eingöngu tölustafir eru leyfðir',
            },
          }}
          defaultValue={tel}
          render={({ onChange, value, name }) => (
            <Input
              label="Símanúmer"
              name={name}
              value={value}
              hasError={errors.tel}
              errorMessage={errors.tel?.message}
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
