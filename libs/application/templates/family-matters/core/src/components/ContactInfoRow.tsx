import React, { useState } from 'react'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { useFormContext } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import { GridColumn, GridContainer, GridRow } from '@island.is/island-ui/core'

interface InputField {
  id: string
  label: string
  error?: string
  clearErrors?: string[]
  defaultValue?: string
}

interface PhoneField extends InputField {
  presentationId: string
}

interface Props {
  email: InputField
  phoneNumber: PhoneField
}

const ContactInfoRow = ({ email, phoneNumber }: Props) => {
  const [statefulPhone, setStatefulPhone] = useState(
    phoneNumber.defaultValue || '',
  )
  const { clearErrors, register } = useFormContext()
  const parsedNumber =
    parsePhoneNumberFromString(statefulPhone, 'IS')?.nationalNumber ||
    statefulPhone
  return (
    <GridContainer>
      <GridRow>
        <GridColumn
          span={['1/1', '1/2', '1/1', '2/3']}
          paddingBottom={[2, 0, 2, 0]}
        >
          <InputController
            id={email.id}
            name={email.id}
            backgroundColor="blue"
            type="email"
            label={email.label}
            error={email.error}
            defaultValue={email.defaultValue || ''}
            onChange={() => {
              clearErrors(email.clearErrors || email.id)
            }}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2', '1/1', '1/3']}>
          <InputController
            id={phoneNumber.presentationId}
            name={phoneNumber.presentationId}
            backgroundColor="blue"
            type="tel"
            label={phoneNumber.label}
            error={phoneNumber.error}
            onChange={(event) => {
              setStatefulPhone(event.target.value)
              clearErrors(phoneNumber.clearErrors || phoneNumber.id)
            }}
            defaultValue={phoneNumber.defaultValue || ''}
          />
        </GridColumn>
        <input
          {...register(`${phoneNumber.id}`)}
          type="hidden"
          value={parsedNumber as string}
        />
      </GridRow>
    </GridContainer>
  )
}

export default ContactInfoRow
