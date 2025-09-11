import React, { FC, useState, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { m } from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { msg } from '../../../../../../lib/messages'
import {
  Box,
  Columns,
  Column,
  Input,
  Text,
  LoadingDots,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import {
  useVerifySms,
  useUpdateOrCreateUserProfile,
  useDeleteEmailOrPhoneValue,
  useUserProfile,
} from '@island.is/portals/my-pages/graphql'
import { sharedMessages } from '@island.is/shared/translations'
import { parseFullNumber } from '@island.is/portals/my-pages/core'
import { FormButton } from '../FormButton'
import * as styles from './ProfileForms.css'
import { ContactNotVerified } from '../ContactNotVerified'
import { useUserInfo } from '@island.is/react-spa/bff'

interface Props {
  buttonText: string
  mobile?: string
  telVerified?: boolean
  telDirty: (isDirty: boolean) => void
  disabled?: boolean
}

interface FormErrors {
  mobile: string | undefined
  code: string | undefined
}

interface UseFormProps {
  tel: string
  code: string
}

export const InputPhone: FC<React.PropsWithChildren<Props>> = ({
  buttonText,
  mobile,
  disabled,
  telDirty,
  telVerified = false,
}) => {
  const userInfo = useUserInfo()
  const isActor = !!userInfo?.profile?.actor?.nationalId

  useNamespaces('sp.settings')
  const methods = useForm<UseFormProps>()
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = methods
  const { updateOrCreateUserProfile, loading: saveLoading } =
    useUpdateOrCreateUserProfile()
  const { deleteEmailOrPhoneValue, loading: deleteLoading } =
    useDeleteEmailOrPhoneValue()
  const { formatMessage } = useLocale()
  const {
    createSmsVerification,
    createMeSmsVerification,
    createLoading,
    createMeLoading,
  } = useVerifySms()
  const { refetch, loading: fetchLoading } = useUserProfile()
  const [telInternal, setTelInternal] = useState(mobile)
  const [telToVerify, setTelToVerify] = useState(mobile)

  const [codeInternal, setCodeInternal] = useState('')

  const [inputPristine, setInputPristine] = useState(false)
  const [telVerifyCreated, setTelVerifyCreated] = useState(false)
  const [verificationValid, setVerificationValid] = useState(telVerified)

  const [resendBlock, setResendBlock] = useState(false)

  const [formErrors, setErrors] = useState<FormErrors>({
    mobile: undefined,
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
    if (mobile && mobile.length > 0) {
      setTelInternal(mobile)
      setValue('tel', mobile, { shouldValidate: true })
    }
    checkSetPristineInput()
  }, [mobile])

  useEffect(() => {
    if (
      telInternal &&
      (mobile === telInternal || telInternal === telToVerify)
    ) {
      telDirty(false)
    } else {
      telDirty(true)
    }
  }, [telInternal, mobile])

  const handleSendTelVerification = async (data: { tel?: string }) => {
    try {
      const telValue = data.tel ?? ''

      setResendBlock(true)

      let response
      if (!isActor) {
        response = await createSmsVerification({
          mobilePhoneNumber: telValue,
        })
      } else {
        response = await createMeSmsVerification({
          mobilePhoneNumber: telValue,
        })
      }

      if (
        response.data?.createSmsVerification?.created ||
        response.data?.createMeSmsVerification?.created
      ) {
        setTelVerifyCreated(true)
        setTelToVerify(telValue)
        setVerificationValid(false)
        setErrors({ ...formErrors, mobile: undefined })
      } else {
        setErrors({ ...formErrors, mobile: formatMessage(m.somethingWrong) })
      }
    } catch (err) {
      console.error(`createSmsVerification error: ${err}`)
      setResendBlock(false)
      setErrors({ ...formErrors, mobile: formatMessage(m.somethingWrong) })
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
      const telValue = formValues?.tel

      if (telValue === telToVerify) {
        await updateOrCreateUserProfile({
          mobilePhoneNumber: `+354-${telToVerify}`,
          smsCode: codeValue,
        }).then(() => {
          checkSetPristineInput()
          setVerificationValid(true)
        })
      }
      setErrors({ ...formErrors, code: undefined })
    } catch (err) {
      console.error(`confirmSmsVerification error: ${err}`)
      setErrors({ ...formErrors, code: codeError })
    } finally {
      setCodeInternal('')
      setValue('code', '')
    }
  }

  const saveEmptyChange = async () => {
    const emailError = formatMessage({
      id: 'sp.settings:email-service-error',
      defaultMessage:
        'Vandamál með tölvupóstþjónustu. Vinsamlegast reynið aftur síðar.',
    })

    try {
      await deleteEmailOrPhoneValue({
        mobilePhoneNumber: true,
      })
      await refetch()

      setVerificationValid(true)
      setInputPristine(true)
      setTelInternal(undefined)
      setErrors({ ...formErrors, code: undefined })
    } catch (err) {
      setErrors({ ...formErrors, code: emailError })
    }
  }

  const checkSetPristineInput = () => {
    if (getValues().tel === mobile) {
      setInputPristine(true)
      setTelVerifyCreated(false)
    } else {
      setInputPristine(false)
      setVerificationValid(false)
    }
  }

  return (
    <Box>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(
            telInternal ? handleSendTelVerification : saveEmptyChange,
          )}
        >
          <Box display="flex" flexWrap="wrap" alignItems="center">
            <Box marginRight={3} width="full" className={styles.formContainer}>
              <Columns>
                <Column width="content">
                  <Box className={styles.countryCodeInput}>
                    <Input
                      label={formatMessage({
                        id: 'sp.settings:phone-country-code',
                        defaultMessage: 'Landsnúmer',
                      })}
                      name="country-code"
                      backgroundColor="blue"
                      size="xs"
                      readOnly
                      value="+354"
                      disabled
                    />
                  </Box>
                </Column>
                <Column>
                  <InputController
                    control={control}
                    id="tel"
                    backgroundColor="blue"
                    name="tel"
                    type="tel"
                    format="### ####"
                    required={false}
                    icon={mobile && verificationValid ? 'checkmark' : undefined}
                    disabled={disabled}
                    size="xs"
                    rules={{
                      minLength: {
                        value: 7,
                        message: formatMessage(msg.errorTelReqLength),
                      },
                      maxLength: {
                        value: 7,
                        message: formatMessage(msg.errorTelReqLength),
                      },
                      pattern: {
                        value: /^\d+$/,
                        message: formatMessage(msg.errorOnlyNumbers),
                      },
                    }}
                    label={formatMessage(sharedMessages.phoneNumber)}
                    placeholder="000 0000"
                    onChange={(inp) => {
                      setTelInternal(parseFullNumber(inp.target.value || ''))
                      setErrors({ ...formErrors, mobile: undefined })
                      checkSetPristineInput()
                    }}
                    error={errors.tel?.message || formErrors.mobile}
                    defaultValue={mobile}
                  />
                </Column>
              </Columns>
            </Box>
            <Box
              display="flex"
              alignItems="flexStart"
              flexDirection="column"
              paddingTop={2}
            >
              {!createLoading &&
                !createMeLoading &&
                !deleteLoading &&
                !fetchLoading && (
                  <>
                    {telVerifyCreated ? (
                      <FormButton
                        disabled={verificationValid || disabled || resendBlock}
                        onClick={
                          telInternal
                            ? () =>
                                handleSendTelVerification({
                                  tel: getValues().tel,
                                })
                            : () => saveEmptyChange()
                        }
                      >
                        {telInternal
                          ? telInternal === telToVerify
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
                        disabled={
                          verificationValid || disabled || inputPristine
                        }
                      >
                        {telInternal
                          ? buttonText
                          : formatMessage(msg.saveEmptyChange)}
                      </FormButton>
                    )}
                  </>
                )}
              {(createLoading ||
                createMeLoading ||
                deleteLoading ||
                fetchLoading) && <LoadingDots />}
            </Box>
          </Box>
        </form>
        {telVerifyCreated && (
          <Box marginTop={3}>
            <Text variant="medium" marginBottom={2}>
              {formatMessage({
                id: 'sp.settings:tel-verify-code-sent',
                defaultMessage: `Öryggiskóði hefur verið sendur í símann þinn. Sláðu hann inn
                  hér að neðan.`,
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
                    format="###"
                    label={formatMessage(m.verificationCode)}
                    placeholder="000"
                    defaultValue=""
                    error={errors.code?.message || formErrors.code}
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

        {mobile &&
          verificationValid === false &&
          inputPristine &&
          !telVerifyCreated && (
            <Box marginTop={2}>
              <ContactNotVerified
                contactType="tel"
                onClick={() =>
                  handleSendTelVerification({
                    tel: mobile,
                  })
                }
              />
            </Box>
          )}
      </FormProvider>
    </Box>
  )
}
