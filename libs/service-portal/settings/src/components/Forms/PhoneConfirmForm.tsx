import { Box, Input } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'

export interface PhoneConfirmFormData {
  code: string
}

interface Props {
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
  onSubmit: (data: PhoneConfirmFormData) => void
}

export const PhoneConfirmForm: FC<Props> = ({
  renderBackButton,
  renderSubmitButton,
  onSubmit,
}) => {
  const { handleSubmit, control, errors } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Controller
          control={control}
          name="code"
          rules={{
            required: {
              value: true,
              message: 'Skylda er að setja inn öryggiskóða',
            },
            pattern: {
              value: /^\d+$/,
              message: 'Eingöngu tölustafir eru leyfðir',
            },
          }}
          defaultValue={''}
          render={({ onChange, value, name }) => (
            <Input
              label="Öryggiskóði"
              name={name}
              value={value}
              hasError={errors.code}
              errorMessage={errors.code?.message}
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
