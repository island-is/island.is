import { toast } from '@island.is/island-ui/core'
import { Box, Input } from '@island.is/island-ui/core'
import { useVerifySms } from '@island.is/service-portal/graphql'
import React, { FC, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

export interface PhoneFormData {
  tel: string
}
interface PhoneConfirmationFormData {
  code: string
}
export interface PhoneFormInternalStep {
  step: 'phone' | 'confirmation'
  tel: string
}

interface Props {
  tel: string
  natReg: string
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
  onInternalStateChange?: (step: PhoneFormInternalStep) => void
  onSubmit: (data: PhoneFormData) => void
}

export const PhoneForm: FC<Props> = ({
  tel,
  natReg,
  renderBackButton,
  renderSubmitButton,
  onInternalStateChange,
  onSubmit,
}) => {
  const { handleSubmit, control, errors, reset } = useForm()
  const { createSmsVerification, confirmSmsVerification } = useVerifySms(natReg)
  const [internalState, setInternalState] = useState<PhoneFormInternalStep>({
    tel,
    step: 'phone',
  })

  useEffect(() => {
    if (tel.length > 0)
      reset({
        tel,
      })
  }, [tel])

  useEffect(() => {
    if (onInternalStateChange) {
      onInternalStateChange(internalState)
    }
  }, [internalState])

  const sendSmsVerificationCode = async (data: PhoneFormData) => {
    try {
      const response = await createSmsVerification({
        mobilePhoneNumber: data.tel,
      })
      if (response.data?.createSmsVerification?.created) {
        setInternalState({
          step: 'confirmation',
          tel: data.tel,
        })
      } else {
        toast.error(
          'Eitthvað fór úrskeiðis, ekki tókst að senda SMS í þetta símanúmer',
        )
      }
    } catch (err) {
      toast.error(
        'Eitthvað fór úrskeiðis, ekki tókst að senda SMS í þetta símanúmer',
      )
    }
  }

  const confirmSmsVerificationCode = async (
    data: PhoneConfirmationFormData,
  ) => {
    try {
      const response = await confirmSmsVerification({
        code: data.code,
      })
      if (response.data?.confirmSmsVerification?.confirmed) {
        onSubmit({ tel: internalState.tel })
      } else {
        toast.error('Eitthvað fór úrskeiðis, kóði var ekki réttur')
      }
    } catch (err) {
      toast.error('Eitthvað fór úrskeiðis, ekki tókst að staðfesta kóða')
    }
  }

  const phoneForm = (
    <form onSubmit={handleSubmit(sendSmsVerificationCode)}>
      <Box>
        <Controller
          control={control}
          name="tel"
          rules={{
            required: {
              value: true,
              message: 'Skylda er að fylla út símanúmer',
            },
            minLength: {
              value: 7,
              message: 'Símanúmer þarf að vera minnst 7 tölustafir á lengd',
            },
            pattern: {
              value: /^\d+$/,
              message: 'Eingöngu tölustafir eru leyfðir',
            },
          }}
          defaultValue={tel}
          render={({ onChange, value, name }) => (
            <Input
              label="Símanúmer"
              name={name}
              value={value}
              hasError={errors.tel}
              errorMessage={errors.tel?.message}
              onChange={onChange}
            />
          )}
        />
      </Box>
      {(renderBackButton || renderSubmitButton) && (
        <Box display="flex" justifyContent="spaceBetween" marginTop={4}>
          {renderBackButton && renderBackButton()}
          {renderSubmitButton && renderSubmitButton()}
        </Box>
      )}
    </form>
  )

  const confirmationForm = (
    <form onSubmit={handleSubmit(confirmSmsVerificationCode)}>
      <Box>
        <Controller
          control={control}
          name="code"
          rules={{
            required: {
              value: true,
              message: 'Skylda er að setja inn öryggiskóða',
            },
            pattern: {
              value: /^\d+$/,
              message: 'Eingöngu tölustafir eru leyfðir',
            },
          }}
          defaultValue={''}
          render={({ onChange, value, name }) => (
            <Input
              label="Öryggiskóði"
              name={name}
              value={value}
              hasError={errors.code}
              errorMessage={errors.code?.message}
              onChange={onChange}
            />
          )}
        />
      </Box>
      {(renderBackButton || renderSubmitButton) && (
        <Box display="flex" justifyContent="spaceBetween" marginTop={4}>
          {renderBackButton && renderBackButton()}
          {renderSubmitButton && renderSubmitButton()}
        </Box>
      )}
    </form>
  )

  return internalState.step === 'phone' ? phoneForm : confirmationForm
}
