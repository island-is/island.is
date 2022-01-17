import React, { FC, useEffect } from 'react'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { sharedMessages } from '@island.is/shared/translations'

export interface EmailFormData {
  email: string
}

interface Props {
  email: string
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
  onResendEmail?: () => void
  onSubmit: (data: EmailFormData) => void
}

export const EmailForm: FC<Props> = ({
  email,
  renderBackButton,
  renderSubmitButton,
  onResendEmail,
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
            <>
              <Input
                name={name}
                label={formatMessage(sharedMessages.email)}
                placeholder={formatMessage(sharedMessages.email)}
                value={value}
                hasError={errors.email}
                errorMessage={errors.email?.message}
                onChange={onChange}
                size="xs"
              />
              {value === email && email.length > 0 && onResendEmail && (
                <Box
                  display="flex"
                  justifyContent="flexEnd"
                  alignItems="center"
                  marginTop={1}
                >
                  <Box marginRight={1}>
                    <Text>
                      {formatMessage({
                        id: 'sp.settings:did-you-not-receive-an-email',
                        defaultMessage: 'Fékkstu ekki staðfestingarpóst?',
                      })}
                    </Text>
                  </Box>
                  <Button variant="text" size="small" onClick={onResendEmail}>
                    {formatMessage({
                      id: 'sp.settings:resend',
                      defaultMessage: 'Endursenda',
                    })}
                  </Button>
                </Box>
              )}
            </>
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
