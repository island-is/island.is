import React, { FC, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, Button, Input } from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { sharedMessages } from '@island.is/shared/translations'

export interface PhoneFormData {
  tel: string
}

interface Props {
  tel: string
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
  onSubmit: (data: PhoneFormData) => void
}

export const SimplePhoneForm: FC<Props> = ({
  tel,
  renderBackButton,
  renderSubmitButton,
  onSubmit,
}) => {
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
              message: formatMessage({
                id: 'sp.settings:tel-required-msg',
                defaultMessage: 'Skylda er að fylla út símanúmer',
              }),
            },
            minLength: {
              // Do we need options for foreign phone numbers?
              value: 7,
              message: formatMessage({
                id: 'sp.settings:tel-required-length-msg',
                defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
              }),
            },
            maxLength: {
              value: 7,
              message: formatMessage({
                id: 'sp.settings:tel-required-length-msg',
                defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
              }),
            },
            pattern: {
              value: /^\d+$/,
              message: formatMessage({
                id: 'sp.settings:only-numbers-allowed',
                defaultMessage: 'Eingöngu tölustafir eru leyfðir',
              }),
            },
          }}
          defaultValue={tel}
          render={({ onChange, value, name }) => (
            <Input
              label={formatMessage(sharedMessages.phoneNumber)}
              placeholder={formatMessage(sharedMessages.phoneNumber)}
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
          {renderSubmitButton && renderSubmitButton()}
        </Box>
      )}
    </form>
  )
}
