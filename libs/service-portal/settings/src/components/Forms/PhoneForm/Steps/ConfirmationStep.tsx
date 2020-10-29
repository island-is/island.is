import React, { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, Button, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

export interface PhoneConfirmationFormData {
  code: string
  tel: string
}

interface Props {
  tel: string
  onSubmit: (data: PhoneConfirmationFormData) => void
  renderSubmitButton?: () => JSX.Element
  onBack: () => void
}

export const ConfirmationStep: FC<Props> = ({
  tel,
  onSubmit,
  renderSubmitButton,
  onBack,
}) => {
  const { formatMessage } = useLocale()
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
          }}
          defaultValue={''}
          render={({ onChange, value, name }) => (
            <Input
              label="Öryggiskóði"
              placeholder="Öryggiskóði"
              name={name}
              value={value}
              hasError={errors.code}
              errorMessage={errors.code?.message}
              onChange={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="tel"
          defaultValue={tel}
          render={({ value, name }) => (
            <input type="hidden" name={name} value={value} />
          )}
        />
      </Box>
      <Box display="flex" justifyContent="spaceBetween" marginTop={4}>
        <Button variant="ghost" onClick={onBack}>
          {formatMessage({
            id: 'service.portal:go-back',
            defaultMessage: 'Til baka',
          })}
        </Button>
        {renderSubmitButton && renderSubmitButton()}
      </Box>
    </form>
  )
}
