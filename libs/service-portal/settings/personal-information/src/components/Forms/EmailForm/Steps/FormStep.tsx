import React, { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Button } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { m } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { sharedMessages } from '@island.is/shared/translations'

export interface EmailFormData {
  email: string
}

interface Props {
  email: string
  onSubmit: (data: EmailFormData) => void
  renderBackButton?: () => JSX.Element
  loading: boolean
  onSkip?: () => void
}

export const FormStep: FC<Props> = ({
  email,
  onSubmit,
  onSkip,
  renderBackButton,
  loading,
}) => {
  const { formatMessage } = useLocale()
  const { handleSubmit, control, errors, reset } = useForm()

  useEffect(() => {
    if (email)
      reset({
        email,
      })
  }, [email])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <InputController
          control={control}
          id="email"
          name="email"
          required={false}
          type="email"
          rules={{
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: formatMessage({
                id: 'sp.settings:email-wrong-format-message',
                defaultMessage: 'Netfangið er ekki á réttu formi',
              }),
            },
          }}
          label={formatMessage(sharedMessages.email)}
          placeholder={formatMessage(sharedMessages.email)}
          error={errors.email?.message}
          defaultValue={email}
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
        {email === '' ? (
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
