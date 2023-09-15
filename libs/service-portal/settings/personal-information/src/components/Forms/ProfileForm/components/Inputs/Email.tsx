import React, { FC, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { m } from '@island.is/service-portal/core'
import { msg } from '../../../../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Text, LoadingDots } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import {
  useVerifyEmail,
  useUpdateOrCreateUserProfile,
  useDeleteIslykillValue,
  useUserProfile,
} from '@island.is/service-portal/graphql'
import { FormButton } from '../FormButton'
import * as styles from './ProfileForms.css'

interface Props {
  buttonText: string
  email?: string
  emailDirty: (isDirty: boolean) => void
  disabled?: boolean
}

interface FormErrors {
  email: string | undefined
  code: string | undefined
}

interface UseFormProps {
  email: string
  code: string
}

export const InputEmail: FC<React.PropsWithChildren<Props>> = ({
  buttonText,
  email,
  disabled,
  emailDirty,
}) => {
  useNamespaces('sp.settings')
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<UseFormProps>()
  const { updateOrCreateUserProfile, loading: saveLoading } =
    useUpdateOrCreateUserProfile()
  const { deleteIslykillValue, loading: deleteLoading } =
    useDeleteIslykillValue()
  const { formatMessage } = useLocale()
  const { createEmailVerification, createLoading } = useVerifyEmail()
  const { refetch, loading: fetchLoading } = useUserProfile()
  const [emailInternal, setEmailInternal] = useState(email)
  const [emailToVerify, setEmailToVerify] = useState(email)

  const [codeInternal, setCodeInternal] = useState('')

  const [inputPristine, setInputPristine] = useState(false)
  const [emailVerifyCreated, setEmailVerifyCreated] = useState(false)
  const [verificationValid, setVerificationValid] = useState(false)

  const [resendBlock, setResendBlock] = useState(false)

  const [formErrors, setErrors] = useState<FormErrors>({
    email: undefined,
    code: undefined,
  })

  useEffect(() => {
    if (resendBlock) {
      const timer = setTimeout(() => {
        setResendBlock(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [resendBlock])

  useEffect(() => {
    if (email && email.length > 0) {
      setEmailInternal(email)
      setValue('email', email, { shouldValidate: true })
    }
    checkSetPristineInput()
  }, [email])

  useEffect(() => {
    if (
      emailInternal &&
      (email === emailInternal || emailInternal === emailToVerify)
    ) {
      emailDirty(false)
    } else {
      emailDirty(true)
    }
  }, [emailInternal, email])

  const handleSendEmailVerification = async (data: { email: string }) => {
    const emailError = formatMessage({
      id: 'sp.settings:email-service-error',
      defaultMessage:
        'Vandamál með tölvupóstþjónustu. Vinsamlegast reynið aftur síðar.',
    })

    try {
      const emailValue = data.email ?? ''

      setResendBlock(true)
      const response = await createEmailVerification({
        email: emailValue,
      })

      if (response.data?.createEmailVerification?.created) {
        setEmailVerifyCreated(true)
        setEmailToVerify(emailValue)
        setVerificationValid(false)
        setErrors({ ...formErrors, email: undefined })
      } else {
        setErrors({ ...formErrors, email: emailError })
      }
    } catch (err) {
      console.error(`createEmailVerification error: ${err}`)
      setResendBlock(false)
      setErrors({ ...formErrors, email: emailError })
    }
  }

  const handleConfirmCode = async (data: { code: string }) => {
    const codeError = formatMessage({
      id: 'sp.settings:code-service-error',
      defaultMessage: 'Villa í staðfestingu kóða. Vinsamlegast reynið aftur.',
    })

    try {
      const codeValue = data.code ?? ''
      const formValues = getValues()
      const emailValue = formValues?.email

      if (emailValue === emailToVerify) {
        await updateOrCreateUserProfile({
          email: emailToVerify,
          emailCode: codeValue,
        }).then(() => {
          setInputPristine(true)
          setVerificationValid(true)
        })
      }
      setErrors({ ...formErrors, code: undefined })
    } catch (err) {
      console.error(`confirmEmailVerification error: ${err}`)
      setErrors({ ...formErrors, code: codeError })
    }
  }

  const saveEmptyChange = async () => {
    const emailError = formatMessage({
      id: 'sp.settings:email-service-error',
      defaultMessage:
        'Vandamál með tölvupóstþjónustu. Vinsamlegast reynið aftur síðar.',
    })

    try {
      await deleteIslykillValue({
        email: true,
      })
      await refetch()
      setVerificationValid(true)
      setInputPristine(true)
      setEmailInternal(undefined)
      setErrors({ ...formErrors, code: undefined })
    } catch (err) {
      setErrors({ ...formErrors, code: emailError })
    }
  }

  const checkSetPristineInput = () => {
    if (getValues().email === email) {
      setInputPristine(true)

      setEmailVerifyCreated(false)
    } else {
      setInputPristine(false)
      setVerificationValid(false)
    }
  }

  return (
    <Box>
      <form
        onSubmit={handleSubmit(
          emailInternal ? handleSendEmailVerification : saveEmptyChange,
        )}
      >
        <Box display="flex" flexWrap="wrap" alignItems="center">
          <Box marginRight={3} width="full" className={styles.formContainer}>
            <InputController
              control={control}
              backgroundColor="blue"
              id="email"
              autoFocus
              name="email"
              required={false}
              type="email"
              icon={inputPristine ? 'checkmark' : undefined}
              disabled={disabled}
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
              onChange={(inp) => {
                setEmailInternal(inp.target.value)
                setErrors({ ...formErrors, email: undefined })
                checkSetPristineInput()
              }}
              placeholder="nafn@island.is"
              error={errors?.email?.message || formErrors?.email}
              size="xs"
              defaultValue={email}
            />
          </Box>
          <Box
            display="flex"
            alignItems="flexStart"
            flexDirection="column"
            paddingTop={2}
          >
            {!createLoading && !deleteLoading && !fetchLoading && (
              <>
                {emailVerifyCreated ? (
                  <FormButton
                    disabled={
                      verificationValid ||
                      disabled ||
                      resendBlock ||
                      inputPristine
                    }
                    onClick={
                      emailInternal
                        ? () =>
                            handleSendEmailVerification({
                              email: getValues().email ?? '',
                            })
                        : () => saveEmptyChange()
                    }
                  >
                    {emailInternal
                      ? emailInternal === emailToVerify
                        ? formatMessage({
                            id: 'sp.settings:resend',
                            defaultMessage: 'Endursenda',
                          })
                        : buttonText
                      : formatMessage(msg.saveEmptyChange)}
                  </FormButton>
                ) : (
                  <FormButton
                    submit
                    disabled={verificationValid || disabled || inputPristine}
                  >
                    {emailInternal
                      ? buttonText
                      : formatMessage(msg.saveEmptyChange)}
                  </FormButton>
                )}
              </>
            )}
            {(createLoading || deleteLoading || fetchLoading) && (
              <LoadingDots />
            )}
          </Box>
        </Box>
      </form>
      {emailVerifyCreated && !inputPristine && (
        <Box marginTop={3}>
          <Text variant="medium" marginBottom={2}>
            {formatMessage({
              id: 'sp.settings:email-verify-code-sent',
              defaultMessage: `Öryggiskóði hefur verið sendur á netfangið þitt. Sláðu hann inn
                  hér að neðan. Athugaðu að pósturinn getur endað með ruslpóstinum.`,
            })}
          </Text>

          <form onSubmit={handleSubmit(handleConfirmCode)}>
            <Box display="flex" flexWrap="wrap" alignItems="flexStart">
              <Box className={styles.codeInput} marginRight={3}>
                <InputController
                  control={control}
                  backgroundColor="blue"
                  id="code"
                  name="code"
                  format="######"
                  label={formatMessage(m.verificationCode)}
                  placeholder="000000"
                  defaultValue=""
                  error={errors?.code?.message || formErrors?.code}
                  disabled={verificationValid || disabled}
                  icon={verificationValid ? 'checkmark' : undefined}
                  size="xs"
                  autoComplete="off"
                  onChange={(inp) => {
                    setCodeInternal(inp.target.value)
                    setErrors({ ...formErrors, code: undefined })
                  }}
                  rules={{
                    required: {
                      value: true,
                      message: formatMessage(m.verificationCodeRequired),
                    },
                  }}
                />
              </Box>
              <Box
                display="flex"
                alignItems="flexStart"
                flexDirection="column"
                paddingTop={4}
                className={styles.codeButton}
              >
                {!saveLoading && (
                  <FormButton
                    submit
                    disabled={!codeInternal || disabled || verificationValid}
                  >
                    {formatMessage(m.codeConfirmation)}
                  </FormButton>
                )}
                {saveLoading && (
                  <Box>
                    <LoadingDots />
                  </Box>
                )}
              </Box>
            </Box>
          </form>
        </Box>
      )}
    </Box>
  )
}
