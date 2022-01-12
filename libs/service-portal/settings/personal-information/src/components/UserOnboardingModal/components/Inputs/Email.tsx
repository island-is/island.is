import React, { FC, useState } from 'react'
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
import { useVerifyEmail } from '@island.is/service-portal/graphql'

interface Props {
  buttonText: string
  onCallback?: (email: string) => void
}

interface FormErrors {
  email: boolean
  code: boolean
}

export const InputEmail: FC<Props> = ({ buttonText, onCallback }) => {
  const { handleSubmit, control, errors, reset } = useForm()
  const { formatMessage } = useLocale()
  const {
    confirmEmailVerification,
    loading,
    createEmailVerification,
    createLoading,
  } = useVerifyEmail()
  const [emailVerifyCreated, setEmailVerifyCreated] = useState(false)
  const [verificationValid, setVerificationValid] = useState(false)
  const [formErrors, setErrors] = useState<FormErrors>({
    email: false,
    code: false,
  })

  const handleSendEmailVerification = async (data: { email: string }) => {
    try {
      const response = await createEmailVerification({
        email: data?.email,
      })

      if (response.data?.createEmailVerification?.created) {
        setEmailVerifyCreated(true)
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
        setVerificationValid(true)
        // Call callback to give email value back to parent.
        // Then save in db since it's valid.
        // if (onCallback) {
        //   onCallback(formValue)
        // }
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
                  message: 'EKKI RÉTT FORMAT - TODO: STRING THIS.',
                },
              }}
              label={'Tölvupóstur'}
              placeholder={'Tölvupóstur'}
              error={errors.email?.message}
              defaultValue={''}
              // defaultValue={email}
            />
          </Column>
          <Column width="3/12">
            <Box display="flex" alignItems="flexEnd" flexDirection="column">
              <button type="submit">
                <Button variant="text" size="small">
                  {buttonText}
                </Button>
              </button>
            </Box>
          </Column>
        </Columns>
      </form>
      {emailVerifyCreated && (
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
                defaultValue={''}
                render={({ onChange, value, name }) => (
                  <Input
                    label={formatMessage(m.verificationCode)}
                    placeholder={formatMessage(m.verificationCode)}
                    name={name}
                    value={value}
                    hasError={errors.code}
                    errorMessage={errors.code?.message}
                    onChange={onChange}
                  />
                )}
              />
            </Column>
            <Column width="3/12">
              <Box display="flex" alignItems="flexEnd" flexDirection="column">
                {verificationValid ? (
                  <Icon icon="checkmarkCircle" color="mint600" type="filled" />
                ) : (
                  <button type="submit">
                    <Button variant="text" size="small">
                      Staðfesta kóða
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
