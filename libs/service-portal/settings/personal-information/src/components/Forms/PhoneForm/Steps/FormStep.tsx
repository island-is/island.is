import React, { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Button } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { m } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { sharedMessages } from '@island.is/shared/translations'

export interface PhoneFormData {
  tel: string
}

interface Props {
  tel: string
  onSubmit: (data: PhoneFormData) => void
  renderBackButton?: () => JSX.Element
  loading: boolean
  onSkip?: () => void
}

export const FormStep: FC<Props> = ({
  tel,
  onSubmit,
  onSkip,
  renderBackButton,
  loading,
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
          type="tel"
          format="### ####"
          required={false}
          defaultValue={tel}
          rules={{
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
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        flexDirection={['columnReverse', 'row']}
        marginTop={4}
      >
        {renderBackButton && <Box marginTop={[1, 0]}>{renderBackButton()}</Box>}
        {tel === '' ? (
          <Button variant="ghost" onClick={onSkip}>
            {formatMessage({
              id: 'sp.settings:finish-later',
              defaultMessage: 'Klára seinna',
            })}
          </Button>
        ) : (
          <Button
            variant="primary"
            type="submit"
            icon="arrowForward"
            disabled={loading}
          >
            {formatMessage(m.confirmCode)}
          </Button>
        )}
      </Box>
    </form>
  )
}
