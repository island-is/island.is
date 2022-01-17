import React, { FC, useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { m } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import {
  Box,
  Button,
  Columns,
  Column,
  Input,
  Icon,
  Text,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useVerifyEmail } from '@island.is/service-portal/graphql'

interface Props {
  buttonText: string
  email?: string
  onCallback: (email: string) => void
  emailDirty: (isDirty: boolean) => void
}

interface FormErrors {
  email: boolean
  code: boolean
}

export const InputEmail: FC<Props> = ({
  buttonText,
  email,
  onCallback,
  emailDirty,
}) => {
  const { handleSubmit, control, errors, getValues } = useForm()
  const { formatMessage } = useLocale()
  const {
    confirmEmailVerification,
    createEmailVerification,
    loading,
    error,
  } = useVerifyEmail()
  const [emailInternal, setEmailInternal] = useState(email || '')
  const [emailToVerify, setEmailToVerify] = useState(email || '')

  const [codeInternal, setCodeInternal] = useState('')

  const [emailVerifyCreated, setEmailVerifyCreated] = useState(false)
  const [verificationValid, setVerificationValid] = useState(false)

  const [formErrors, setErrors] = useState<FormErrors>({
    email: false,
    code: false,
  })

  useEffect(() => {
    if (email === emailInternal) {
      emailDirty(false)
    } else if (emailInternal === emailToVerify) {
      emailDirty(false)
    } else {
      emailDirty(true)
    }
  }, [emailInternal])

  const handleSendEmailVerification = async (data: { email: string }) => {
    try {
      const response = await createEmailVerification({
        email: data?.email,
      })

      if (response.data?.createEmailVerification?.created) {
        setEmailVerifyCreated(true)
        setEmailToVerify(data?.email)
        setVerificationValid(false)
        setErrors({ ...formErrors, email: false })
      } else {
        setErrors({ ...formErrors, email: true })
      }
    } catch (err) {
      setErrors({ ...formErrors, email: true })
    }
  }

  const handleConfirmCode = async (data: { code: string }) => {
    try {
      const response = await confirmEmailVerification({
        hash: data?.code,
      })
      if (response.data?.confirmEmailVerification?.confirmed) {
        const formValues = getValues()
        const emailValue = formValues?.email
        if (emailValue === emailToVerify) {
          setVerificationValid(true)
          emailDirty(false)
          onCallback(emailValue)
        }
        setErrors({ ...formErrors, code: false })
      } else {
        setErrors({ ...formErrors, code: true })
      }
    } catch (err) {
      setErrors({ ...formErrors, code: true })
    }
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(handleSendEmailVerification)}>
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
              error={errors.email?.message}
              defaultValue={email || ''}
              size="xs"
            />
          </Column>
          <Column width="3/12">
            <Box
              display="flex"
              alignItems="flexEnd"
              flexDirection="column"
              paddingTop={2}
            >
              <button type="submit" disabled={!emailInternal}>
                <Button variant="text" size="small" disabled={!emailInternal}>
                  {buttonText}
                </Button>
              </button>
            </Box>
          </Column>
        </Columns>
      </form>
      {emailVerifyCreated && (
        <form onSubmit={handleSubmit(handleConfirmCode)}>
          <Box marginTop={3}>
            <Text variant="medium" marginBottom={2}>
              Öryggiskóði hefur verið sendur á netfangið þitt. Sláðu hann inn
              hér að neðan.
            </Text>
            <Columns alignY="center">
              <Column width="5/12">
                <Controller
                  control={control}
                  name="code"
                  rules={{
                    required: {
                      value: true,
                      message: formatMessage(m.verificationCodeRequired),
                    },
                  }}
                  defaultValue=""
                  render={({ onChange, value, name }) => (
                    <Input
                      label={formatMessage(m.verificationCode)}
                      placeholder={formatMessage(m.verificationCode)}
                      name={name}
                      value={value}
                      hasError={errors.code}
                      errorMessage={errors.code?.message}
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
                  {verificationValid ? (
                    <Icon
                      icon="checkmarkCircle"
                      color="mint600"
                      type="filled"
                    />
                  ) : (
                    <button type="submit" disabled={!codeInternal}>
                      <Button
                        variant="text"
                        size="small"
                        disabled={!codeInternal}
                      >
                        {formatMessage(m.confirmCode)}
                      </Button>
                    </button>
                  )}
                </Box>
              </Column>
            </Columns>
          </Box>
        </form>
      )}
    </Box>
  )
}
