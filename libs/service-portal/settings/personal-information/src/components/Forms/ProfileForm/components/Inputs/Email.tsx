import React, { FC, useState, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import { m } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  Button,
  Columns,
  Column,
  Input,
  Icon,
  Text,
  LoadingDots,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useVerifyEmail } from '@island.is/service-portal/graphql'
import { HookFormType } from '../../types/form'

interface Props {
  buttonText: string
  email?: string
  hookFormData: HookFormType
  onValid: (val: boolean) => void
}

interface FormErrors {
  email: string | undefined
  code: string | undefined
}

export const InputEmail: FC<Props> = ({
  buttonText,
  email,
  hookFormData,
  onValid,
}) => {
  useNamespaces('sp.settings')
  const { control, errors, getValues, trigger } = hookFormData
  const { formatMessage } = useLocale()
  const {
    confirmEmailVerification,
    createEmailVerification,
    loading: codeLoading,
    createLoading,
  } = useVerifyEmail()
  const [emailInternal, setEmailInternal] = useState(email)
  const [emailToVerify, setEmailToVerify] = useState(email || '')

  const [codeInternal, setCodeInternal] = useState('')

  const [emailVerifyCreated, setEmailVerifyCreated] = useState(false)
  const [verificationValid, setVerificationValid] = useState(false)

  const [formErrors, setErrors] = useState<FormErrors>({
    email: undefined,
    code: undefined,
  })

  useEffect(() => {
    if (email && email.length > 0) {
      setEmailInternal(email)
    }
  }, [email])

  const handleSendEmailVerification = async (isValid: boolean) => {
    if (!isValid) {
      return
    }

    const emailError = formatMessage({
      id: 'sp.settings:email-service-error',
      defaultMessage:
        'Vandamál með tölvupóstþjónustu. Vinsamlegast reynið aftur síðar.',
    })

    try {
      const formValues = getValues()
      const emailValue = formValues?.email

      const response = await createEmailVerification({
        email: emailValue,
      })

      if (response.data?.createEmailVerification?.created) {
        setEmailVerifyCreated(true)
        setEmailToVerify(emailValue)
        setVerificationValid(false)
        onValid(false)
        setErrors({ ...formErrors, email: undefined })
      } else {
        setErrors({ ...formErrors, email: emailError })
      }
    } catch (err) {
      setErrors({ ...formErrors, email: emailError })
    }
  }

  const handleConfirmCode = async (isValid: boolean) => {
    if (!isValid) {
      return
    }

    const codeError = formatMessage({
      id: 'sp.settings:code-service-error',
      defaultMessage:
        'Vandamál með tölvupóstþjónustu. Vinsamlegast reynið aftur síðar.',
    })

    try {
      const formValues = getValues()
      const codeValue = formValues?.code

      const response = await confirmEmailVerification({
        hash: codeValue,
      })

      if (response.data?.confirmEmailVerification?.confirmed) {
        const formValues = getValues()
        const emailValue = formValues?.email
        if (emailValue === emailToVerify) {
          setVerificationValid(true)
          onValid(true)
        }
        setErrors({ ...formErrors, code: undefined })
      } else {
        setErrors({ ...formErrors, code: codeError })
      }
    } catch (err) {
      setErrors({ ...formErrors, code: codeError })
    }
  }

  return (
    <Box>
      <Columns alignY="center">
        <Column width="9/12">
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
            label={formatMessage(m.email)}
            onChange={(inp) => setEmailInternal(inp.target.value)}
            placeholder={formatMessage(m.email)}
            error={errors.email?.message || formErrors.email}
            size="xs"
            defaultValue=""
          />
        </Column>
        <Column width="3/12">
          <Box
            display="flex"
            alignItems="flexEnd"
            flexDirection="column"
            paddingTop={2}
          >
            {!createLoading && (
              <Button
                variant="text"
                size="small"
                disabled={!emailInternal}
                onClick={() => {
                  trigger('email').then((ok) => handleSendEmailVerification(ok))
                }}
              >
                {buttonText}
              </Button>
            )}
            {createLoading && <LoadingDots />}
          </Box>
        </Column>
      </Columns>
      {emailVerifyCreated && (
        <Box marginTop={3}>
          <Text variant="medium" marginBottom={2}>
            {formatMessage({
              id: 'sp.settings:email-verify-code-sent',
              defaultMessage: `Öryggiskóði hefur verið sendur á netfangið þitt. Sláðu hann inn
                  hér að neðan.`,
            })}
          </Text>
          <Columns alignY="center">
            <Column width="5/12">
              <Controller
                control={control}
                name="code"
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: formatMessage(m.verificationCodeRequired),
                  },
                }}
                render={({ onChange, value, name }) => (
                  <Input
                    label={formatMessage(m.verificationCode)}
                    placeholder={formatMessage(m.verificationCode)}
                    name={name}
                    value={value}
                    hasError={errors.code || !!formErrors.code}
                    errorMessage={errors.code?.message || formErrors.code}
                    size="xs"
                    onChange={(inp) => {
                      onChange(inp.target.value)
                      setCodeInternal(inp.target.value)
                    }}
                  />
                )}
              />
            </Column>
            <Column width="content">
              <Box
                marginLeft={3}
                display="flex"
                alignItems="flexEnd"
                flexDirection="column"
                paddingTop={2}
              >
                {!codeLoading &&
                  (verificationValid ? (
                    <Icon
                      icon="checkmarkCircle"
                      color="mint600"
                      type="filled"
                    />
                  ) : (
                    <Button
                      variant="text"
                      size="small"
                      disabled={!codeInternal}
                      onClick={() => {
                        trigger('code').then((ok) => handleConfirmCode(ok))
                      }}
                    >
                      {formatMessage(m.confirmCode)}
                    </Button>
                  ))}
                {codeLoading && <LoadingDots />}
              </Box>
            </Column>
          </Columns>
        </Box>
      )}
    </Box>
  )
}
