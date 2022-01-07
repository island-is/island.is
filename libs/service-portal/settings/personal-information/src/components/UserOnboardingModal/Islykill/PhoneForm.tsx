import React, { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'
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
        <InputController
          control={control}
          id="tel"
          name="tel"
          required={true}
          type="tel"
          format="### ####"
          rules={{
            required: {
              value: true,
              message: formatMessage({
                id: 'sp.settings:tel-required-msg',
                defaultMessage: 'Skylda er að fylla út símanúmer',
              }),
            },
            minLength: {
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
          label={formatMessage(sharedMessages.phoneNumber)}
          error={errors.tel?.message}
          size="xs"
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
