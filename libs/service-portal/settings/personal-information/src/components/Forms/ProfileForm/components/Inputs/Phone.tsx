import React, { FC, useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
import {
  useVerifySms,
  useUpdateOrCreateUserProfile,
} from '@island.is/service-portal/graphql'
import { sharedMessages } from '@island.is/shared/translations'
import { parseNumber } from '../../../../../utils/phoneHelper'
import * as styles from './Phone.css'

interface Props {
  buttonText: string
  mobile?: string
  telDirty: (isDirty: boolean) => void
}

interface FormErrors {
  mobile: string | undefined
  code: string | undefined
}

export const InputPhone: FC<Props> = ({ buttonText, mobile, telDirty }) => {
  useNamespaces('sp.settings')
  const { handleSubmit, control, errors, getValues } = useForm()
  const {
    updateOrCreateUserProfile,
    loading: saveLoading,
  } = useUpdateOrCreateUserProfile()
  const { formatMessage } = useLocale()
  const {
    confirmSmsVerification,
    createSmsVerification,
    createLoading,
    confirmLoading,
  } = useVerifySms()
  const [telInternal, setTelInternal] = useState(mobile)
  const [telToVerify, setTelToVerify] = useState(mobile)

  const [codeInternal, setCodeInternal] = useState('')

  const [telVerifyCreated, setTelVerifyCreated] = useState(false)
  const [verificationValid, setVerificationValid] = useState(false)
  const [verifiCationLoading, setVerifiCationLoading] = useState(false)

  const [formErrors, setErrors] = useState<FormErrors>({
    mobile: undefined,
    code: undefined,
  })

  useEffect(() => {
    if (mobile && mobile.length > 0) {
      setTelInternal(mobile)
    }
  }, [mobile])

  useEffect(() => {
    if (mobile === telInternal || telInternal === telToVerify) {
      telDirty(false)
    } else {
      telDirty(true)
    }
  }, [telInternal])

  const handleSendTelVerification = async (data: { tel: string }) => {
    const telError = formatMessage({
      id: 'sp.settings:tel-service-error',
      defaultMessage:
        'Vandamál með farsímaþjónustu. Vinsamlegast reynið aftur síðar.',
    })

    try {
      const telValue = data.tel ?? ''

      const response = await createSmsVerification({
        mobilePhoneNumber: telValue,
      })

      if (response.data?.createSmsVerification?.created) {
        setTelVerifyCreated(true)
        setTelToVerify(telValue)
        setVerificationValid(false)
        setErrors({ ...formErrors, mobile: undefined })
      } else {
        setErrors({ ...formErrors, mobile: telError })
      }
    } catch (err) {
      setErrors({ ...formErrors, mobile: telError })
    }
  }

  const handleConfirmCode = async (data: { code: string }) => {
    const telError = formatMessage({
      id: 'sp.settings:tel-service-error',
      defaultMessage:
        'Vandamál með farsímaþjónustu. Vinsamlegast reynið aftur síðar.',
    })

    try {
      const codeValue = data.code ?? ''

      setVerifiCationLoading(true)
      const response = await confirmSmsVerification({
        code: codeValue,
      })

      if (response.data?.confirmSmsVerification?.confirmed) {
        const formValues = getValues()
        const telValue = formValues?.tel
        if (telValue === telToVerify) {
          await updateOrCreateUserProfile({
            mobilePhoneNumber: `+354-${telToVerify}`,
          }).then(() => {
            setVerifiCationLoading(false)
            setVerificationValid(true)
          })
        }
        setErrors({ ...formErrors, code: undefined })
      } else {
        setVerifiCationLoading(false)
        setErrors({ ...formErrors, code: telError })
      }
    } catch (err) {
      setVerifiCationLoading(false)
      setErrors({ ...formErrors, code: telError })
    }
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(handleSendTelVerification)}>
        <Columns collapseBelow="sm" alignY="center">
          <Column width="9/12">
            <Columns>
              <Column width="content">
                <Box className={styles.countryCodeInput}>
                  <Input
                    label="Landsnúmer"
                    name="country-code"
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
                  name="tel"
                  type="tel"
                  format="### ####"
                  required={false}
                  defaultValue={mobile}
                  disabled={verificationValid}
                  size="xs"
                  rules={{
                    minLength: {
                      value: 7,
                      message: formatMessage({
                        id: 'sp.settings:tel-required-length-msg',
                        defaultMessage:
                          'Símanúmer þarf að vera 7 tölustafir á lengd',
                      }),
                    },
                    maxLength: {
                      value: 7,
                      message: formatMessage({
                        id: 'sp.settings:tel-required-length-msg',
                        defaultMessage:
                          'Símanúmer þarf að vera 7 tölustafir á lengd',
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
                  placeholder={formatMessage(sharedMessages.phoneNumber)}
                  onChange={(inp) =>
                    setTelInternal(parseNumber(inp.target.value || ''))
                  }
                  error={errors.tel?.message || formErrors.mobile}
                />
              </Column>
            </Columns>
          </Column>
          <Column width="3/12">
            <Box
              display="flex"
              alignItems="flexEnd"
              flexDirection="column"
              paddingTop={2}
            >
              {!createLoading && (
                <button
                  type="submit"
                  disabled={!telInternal || verificationValid}
                >
                  <Button
                    variant="text"
                    disabled={!telInternal || verificationValid}
                    size="small"
                  >
                    {buttonText}
                  </Button>
                </button>
              )}
              {createLoading && <LoadingDots />}
            </Box>
          </Column>
        </Columns>
        {verificationValid && (
          <Columns alignY="center">
            <Column>
              <Box paddingTop={1}>
                <Button
                  onClick={() => {
                    setTelVerifyCreated(false)
                    setVerificationValid(false)
                  }}
                  variant="text"
                  size="small"
                >
                  Breyta
                </Button>
              </Box>
            </Column>
          </Columns>
        )}
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
                      disabled={verificationValid}
                      name={name}
                      value={value}
                      size="xs"
                      hasError={errors.code || !!formErrors.code}
                      errorMessage={errors.code?.message || formErrors.code}
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
                  {!verifiCationLoading &&
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
                  {verifiCationLoading && <LoadingDots />}
                </Box>
              </Column>
            </Columns>
          </form>
        </Box>
      )}
    </Box>
  )
}
