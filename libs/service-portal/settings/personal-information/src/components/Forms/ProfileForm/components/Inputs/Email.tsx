import React, { FC, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { m } from '@island.is/service-portal/core'
import { msg } from '../../../../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  Button,
  Columns,
  Column,
  Icon,
  Text,
  LoadingDots,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import {
  useVerifyEmail,
  useUpdateOrCreateUserProfile,
  useDeleteIslykillValue,
} from '@island.is/service-portal/graphql'

interface Props {
  buttonText: string
  email: string
  emailDirty: (isDirty: boolean) => void
}

interface FormErrors {
  email: string | undefined
  code: string | undefined
}

export const InputEmail: FC<Props> = ({ buttonText, email, emailDirty }) => {
  useNamespaces('sp.settings')
  const { handleSubmit, control, errors, getValues } = useForm()
  const {
    updateOrCreateUserProfile,
    loading: saveLoading,
  } = useUpdateOrCreateUserProfile()
  const {
    deleteIslykillValue,
    loading: deleteLoading,
  } = useDeleteIslykillValue()
  const { formatMessage } = useLocale()
  const {
    createEmailVerification,
    loading: codeLoading,
    createLoading,
  } = useVerifyEmail()
  const [emailInternal, setEmailInternal] = useState(email)
  const [emailToVerify, setEmailToVerify] = useState(email)

  const [codeInternal, setCodeInternal] = useState('')

  const [emailVerifyCreated, setEmailVerifyCreated] = useState(false)
  const [verificationValid, setVerificationValid] = useState(false)
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  const [formErrors, setErrors] = useState<FormErrors>({
    email: undefined,
    code: undefined,
  })

  useEffect(() => {
    if (email && email.length > 0) {
      setEmailInternal(email)
    }
  }, [email])

  useEffect(() => {
    if (email === emailInternal || emailInternal === emailToVerify) {
      emailDirty(false)
    } else {
      emailDirty(true)
    }
  }, [emailInternal])

  const handleSendEmailVerification = async (data: { email: string }) => {
    const emailError = formatMessage({
      id: 'sp.settings:email-service-error',
      defaultMessage:
        'Vandamál með tölvupóstþjónustu. Vinsamlegast reynið aftur síðar.',
    })

    try {
      const emailValue = data.email ?? ''

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
      setErrors({ ...formErrors, email: emailError })
    }
  }

  const handleConfirmCode = async (data: { code: string }) => {
    const codeError = formatMessage({
      id: 'sp.settings:code-service-error',
      defaultMessage: 'Villa í staðfestingu kóða. Vinsamlegast reynið aftur.',
    })

    try {
      setVerificationLoading(true)

      const codeValue = data.code ?? ''
      const formValues = getValues()
      const emailValue = formValues?.email

      if (emailValue === emailToVerify) {
        await updateOrCreateUserProfile({
          email: emailToVerify,
          emailCode: codeValue,
        }).then(() => {
          setVerificationLoading(false)
          setVerificationValid(true)
        })
      }
      setErrors({ ...formErrors, code: undefined })
    } catch (err) {
      console.error(`confirmEmailVerification error: ${err}`)
      setVerificationLoading(false)
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

      setVerificationValid(true)
      setDeleteSuccess(true)
      setErrors({ ...formErrors, code: undefined })
    } catch (err) {
      setVerificationLoading(false)
      setErrors({ ...formErrors, code: emailError })
    }
  }

  return (
    <Box>
      <form
        onSubmit={handleSubmit(
          emailInternal ? handleSendEmailVerification : saveEmptyChange,
        )}
      >
        <Columns collapseBelow="sm" alignY="center">
          <Column width="9/12">
            <InputController
              control={control}
              backgroundColor="blue"
              id="email"
              name="email"
              required={false}
              type="email"
              disabled={verificationValid}
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
              defaultValue={email}
            />
          </Column>
          <Column width="3/12">
            <Box
              display="flex"
              alignItems="flexEnd"
              flexDirection="column"
              paddingTop={2}
            >
              {!createLoading && !deleteLoading && (
                <button type="submit" disabled={verificationValid}>
                  <Button
                    variant="text"
                    size="small"
                    disabled={verificationValid}
                  >
                    {emailInternal
                      ? emailVerifyCreated
                        ? formatMessage({
                            id: 'sp.settings:resend',
                            defaultMessage: 'Endursenda',
                          })
                        : buttonText
                      : formatMessage(msg.saveEmptyChange)}
                  </Button>
                </button>
              )}
              {(createLoading || deleteLoading) && <LoadingDots />}
            </Box>
          </Column>
        </Columns>
        {verificationValid && (
          <Columns alignY="center">
            <Column>
              <Box paddingTop={1}>
                <Button
                  onClick={() => {
                    setEmailVerifyCreated(false)
                    setVerificationValid(false)
                    setDeleteSuccess(false)
                  }}
                  variant="text"
                  size="small"
                >
                  {formatMessage(msg.buttonChange)}
                </Button>
              </Box>
            </Column>
            {deleteSuccess ? (
              <Column width="content">
                <Box
                  marginLeft={3}
                  display="flex"
                  alignItems="flexStart"
                  flexDirection="column"
                >
                  <Icon icon="checkmarkCircle" color="mint600" type="filled" />
                </Box>
              </Column>
            ) : null}
          </Columns>
        )}
      </form>
      {emailVerifyCreated && (
        <Box marginTop={3}>
          <Text variant="medium" marginBottom={2}>
            {formatMessage({
              id: 'sp.settings:email-verify-code-sent',
              defaultMessage: `Öryggiskóði hefur verið sendur á netfangið þitt. Sláðu hann inn
                  hér að neðan. Athugaðu að pósturinn getur endað með ruslpóstinum.`,
            })}
          </Text>

          <form onSubmit={handleSubmit(handleConfirmCode)}>
            <Columns alignY="center">
              <Column width="5/12">
                <InputController
                  control={control}
                  backgroundColor="blue"
                  id="code"
                  name="code"
                  format="######"
                  label={formatMessage(m.verificationCode)}
                  placeholder={formatMessage(m.verificationCode)}
                  defaultValue=""
                  error={errors.code?.message || formErrors.code}
                  disabled={verificationValid}
                  size="xs"
                  onChange={(inp) => {
                    setCodeInternal(inp.target.value)
                  }}
                  rules={{
                    required: {
                      value: true,
                      message: formatMessage(m.verificationCodeRequired),
                    },
                  }}
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
                  {!verificationLoading &&
                    (verificationValid ? (
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
                    ))}
                  {verificationLoading && <LoadingDots />}
                </Box>
              </Column>
            </Columns>
          </form>
        </Box>
      )}
    </Box>
  )
}
