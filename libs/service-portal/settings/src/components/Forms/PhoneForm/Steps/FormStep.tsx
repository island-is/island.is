import React, { FC, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, Button, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

export interface PhoneFormData {
  tel: string
}

interface Props {
  tel: string
  onSubmit: (data: PhoneFormData) => void
  renderBackButton?: () => JSX.Element
}

export const FormStep: FC<Props> = ({ tel, onSubmit, renderBackButton }) => {
  const { formatMessage } = useLocale()
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
              placeholder="Símanúmer"
              name={name}
              value={value}
              hasError={errors.tel}
              errorMessage={errors.tel?.message}
              onChange={onChange}
            />
          )}
        />
      </Box>
      <Box display="flex" justifyContent="spaceBetween" marginTop={4}>
        {renderBackButton && renderBackButton()}
        <Button variant="primary" type="submit" icon="arrowForward">
          {formatMessage({
            id: 'service.portal:confirm-code',
            defaultMessage: 'Senda staðfestingarkóða',
          })}
        </Button>
      </Box>
    </form>
  )
}
