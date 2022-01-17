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
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useVerifySms } from '@island.is/service-portal/graphql'
import { sharedMessages } from '@island.is/shared/translations'

interface Props {
  buttonText: string
  mobile?: string
  onCallback: (mobile: string) => void
  telDirty: (isDirty: boolean) => void
}

interface FormErrors {
  mobile: boolean
  code: boolean
}

export const InputPhone: FC<Props> = ({
  buttonText,
  mobile,
  onCallback,
  telDirty,
}) => {
  const { handleSubmit, control, errors, getValues } = useForm()
  const { formatMessage } = useLocale()
  const {
    confirmSmsVerification,
    createSmsVerification,
    createError,
    createLoading,
  } = useVerifySms()
  const [telInternal, setTelInternal] = useState(mobile || '')
  const [telToVerify, setTelToVerify] = useState(mobile || '')

  const [codeInternal, setCodeInternal] = useState('')

  const [telVerifyCreated, setTelVerifyCreated] = useState(false)
  const [verificationValid, setVerificationValid] = useState(false)

  const [formErrors, setErrors] = useState<FormErrors>({
    mobile: false,
    code: false,
  })

  useEffect(() => {
    if (mobile === telInternal) {
      telDirty(false)
    } else if (telInternal === telToVerify) {
      telDirty(false)
    } else {
      telDirty(true)
    }
  }, [telInternal])

  const handleSendTellVerification = async (data: { tel: string }) => {
    try {
      const response = await createSmsVerification({
        mobilePhoneNumber: data?.tel,
      })

      if (response.data?.createSmsVerification?.created) {
        setTelVerifyCreated(true)
        setTelToVerify(data?.tel)
        setVerificationValid(false)
        setErrors({ ...formErrors, mobile: false })
      } else {
        setErrors({ ...formErrors, mobile: true })
      }
    } catch (err) {
      setErrors({ ...formErrors, mobile: true })
    }
  }

  const handleConfirmCode = async (data: { code: string }) => {
    try {
      const response = await confirmSmsVerification({
        code: data?.code,
      })
      if (response.data?.confirmSmsVerification?.confirmed) {
        const formValues = getValues()
        const telValue = formValues?.tel
        if (telValue === telToVerify) {
          setVerificationValid(true)
          telDirty(false)
          onCallback(telValue)
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
      <form onSubmit={handleSubmit(handleSendTellVerification)}>
        <Columns alignY="center">
          <Column width="9/12">
            <InputController
              control={control}
              id="tel"
              name="tel"
              type="tel"
              format="### ####"
              required={false}
              defaultValue={telInternal || ''}
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
              error={errors.tel?.message}
            />
          </Column>
          <Column width="3/12">
            <Box display="flex" alignItems="flexEnd" flexDirection="column">
              <button type="submit" disabled={!telInternal}>
                <Button variant="text" disabled={!telInternal} size="small">
                  {buttonText}
                </Button>
              </button>
            </Box>
          </Column>
        </Columns>
      </form>
      {telVerifyCreated && (
        <form onSubmit={handleSubmit(handleConfirmCode)}>
          <Columns alignY="center">
            <Column width="9/12">
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
                    onChange={(inp) => {
                      onChange(inp.target.value)
                      setCodeInternal(inp.target.value)
                    }}
                  />
                )}
              />
            </Column>
            <Column width="3/12">
              <Box display="flex" alignItems="flexEnd" flexDirection="column">
                {verificationValid ? (
                  <Icon icon="checkmarkCircle" color="mint600" type="filled" />
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
        </form>
      )}
    </Box>
  )
}
