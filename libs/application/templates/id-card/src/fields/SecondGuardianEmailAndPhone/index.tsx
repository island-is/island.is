import { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { GridRow, GridColumn } from '@island.is/island-ui/core'
import {
  InputController,
  PhoneInputController,
} from '@island.is/shared/form-fields'
import { applicantInformation, error } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { Routes } from '../../lib/constants'

type FieldError =
  | {
      secondGuardianInformation?: {
        email?: string
        phoneNumber?: string
      }
      applicantInformation?: string
    }
  | undefined

export const SecondGuardianEmailAndPhone: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { formatMessage } = useLocale()
  const { control } = useFormContext()
  const { application, field, errors, setBeforeSubmitCallback } = props

  const [email, setEmail] = useState<string>(
    getValueViaPath(
      application.answers,
      `${Routes.SECONDGUARDIANINFORMATION}.email`,
      '',
    ) as string,
  )
  const [phone, setPhone] = useState<string>(
    getValueViaPath(
      application.answers,
      `${Routes.SECONDGUARDIANINFORMATION}.phoneNumber`,
      '',
    ) as string,
  )

  const fieldError = errors as FieldError

  const getEmailError = () => {
    if (email.length === 0 && !fieldError?.secondGuardianInformation?.email)
      return (
        fieldError?.applicantInformation && formatMessage(error.invalidValue)
      )
    return fieldError?.secondGuardianInformation?.email
  }
  const getPhoneError = () => {
    if (
      phone.length === 0 &&
      !fieldError?.secondGuardianInformation?.phoneNumber
    )
      return (
        fieldError?.applicantInformation && formatMessage(error.invalidValue)
      )
    return fieldError?.secondGuardianInformation?.phoneNumber
  }

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      if (email.length === 0 || phone.length === 0) {
        return [false, 'invalid empty input']
      }
      return [true, null]
    })

  return (
    <GridRow rowGap={2} marginTop={2}>
      <GridColumn span={['1/1', '1/1', '1/2']}>
        <InputController
          id={`${field.id}.email`}
          type="email"
          control={control}
          backgroundColor="blue"
          label={formatMessage(applicantInformation.labels.applicantEmail)}
          error={getEmailError()}
          required
          onChange={(event) => setEmail(event.target.value)}
        />
      </GridColumn>
      <GridColumn span={['1/1', '1/1', '1/2']}>
        <PhoneInputController
          id={`${field.id}.phoneNumber`}
          control={control}
          backgroundColor="blue"
          disableDropdown
          label={formatMessage(
            applicantInformation.labels.applicantPhoneNumber,
          )}
          error={getPhoneError()}
          required
          onChange={(event) => setPhone(event.target.value)}
        />
      </GridColumn>
    </GridRow>
  )
}
