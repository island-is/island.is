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
import { useVerifySms } from '@island.is/service-portal/graphql'
import { sharedMessages } from '@island.is/shared/translations'
import { parseNumber } from '../../../../../utils/phoneHelper'
import { HookFormType } from '../../types/form'
import * as styles from './Phone.css'

interface Props {
  buttonText: string
  mobile?: string
  hookFormData: HookFormType
  onValid: (val: boolean) => void
}

interface FormErrors {
  mobile: string | undefined
  code: string | undefined
}

export const InputPhone: FC<Props> = ({
  buttonText,
  mobile,
  hookFormData,
  onValid,
}) => {
  useNamespaces('sp.settings')
  const { control, errors, getValues, trigger } = hookFormData
  const { formatMessage } = useLocale()
  const {
    confirmSmsVerification,
    createSmsVerification,
    createLoading,
    confirmLoading,
  } = useVerifySms()
  const [telInternal, setTelInternal] = useState(mobile || '')
  const [telToVerify, setTelToVerify] = useState(mobile || '')

  const [codeInternal, setCodeInternal] = useState('')

  const [telVerifyCreated, setTelVerifyCreated] = useState(false)
  const [verificationValid, setVerificationValid] = useState(false)

  const [formErrors, setErrors] = useState<FormErrors>({
    mobile: undefined,
    code: undefined,
  })

  useEffect(() => {
    if (mobile && mobile.length > 0) {
      setTelInternal(mobile)
    }
  }, [mobile])

  const handleSendTelVerification = async (isValid: boolean) => {
    if (!isValid) {
      return
    }

    const telError = formatMessage({
      id: 'sp.settings:tel-service-error',
      defaultMessage:
        'Vandamál með farsímaþjónustu. Vinsamlegast reynið aftur síðar.',
    })

    try {
      const formValues = getValues()
      const telValue = formValues?.tel

      const response = await createSmsVerification({
        mobilePhoneNumber: parseNumber(telValue),
      })

      if (response.data?.createSmsVerification?.created) {
        setTelVerifyCreated(true)
        setTelToVerify(telValue)
        setVerificationValid(false)
        onValid(false)
        setErrors({ ...formErrors, mobile: undefined })
      } else {
        setErrors({ ...formErrors, mobile: telError })
      }
    } catch (err) {
      setErrors({ ...formErrors, mobile: telError })
    }
  }

  const handleConfirmCode = async (isValid: boolean) => {
    if (!isValid) {
      return
    }

    const telError = formatMessage({
      id: 'sp.settings:tel-service-error',
      defaultMessage:
        'Vandamál með farsímaþjónustu. Vinsamlegast reynið aftur síðar.',
    })

    try {
      const formValues = getValues()
      const codeValue = formValues?.code

      const response = await confirmSmsVerification({
        code: codeValue,
      })

      if (response.data?.confirmSmsVerification?.confirmed) {
        const formValues = getValues()
        const telValue = formValues?.tel
        if (telValue === telToVerify) {
          setVerificationValid(true)
          onValid(true)
        }
        setErrors({ ...formErrors, code: undefined })
      } else {
        setErrors({ ...formErrors, code: telError })
      }
    } catch (err) {
      setErrors({ ...formErrors, code: telError })
    }
  }

  return (
    <Box>
      <Columns alignY="center">
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
                onChange={(inp) => setTelInternal(inp.target.value)}
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
              <Button
                variant="text"
                disabled={!telInternal}
                size="small"
                onClick={() => {
                  trigger('tel').then((ok) => handleSendTelVerification(ok))
                }}
              >
                {buttonText}
              </Button>
            )}
            {createLoading && <LoadingDots />}
          </Box>
        </Column>
      </Columns>
      {telVerifyCreated && (
        <Box marginTop={3}>
          <Text variant="medium" marginBottom={2}>
            {formatMessage({
              id: 'sp.settings:tel-verify-code-sent',
              defaultMessage: `Öryggiskóði hefur verið sendur á netfangið þitt. Sláðu hann inn
                  hér að neðan.`,
            })}
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
                {!confirmLoading &&
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
                {confirmLoading && <LoadingDots />}
              </Box>
            </Column>
          </Columns>
        </Box>
      )}
    </Box>
  )
}
