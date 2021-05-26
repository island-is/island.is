import React from 'react'
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

interface Props {
  email: InputField
  phoneNumber: InputField
}

const ContactInfoRow = ({ email, phoneNumber }: Props) => {
  const { clearErrors } = useFormContext()

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
            id={phoneNumber.id}
            name={phoneNumber.id}
            backgroundColor="blue"
            type="tel"
            label={phoneNumber.label}
            error={phoneNumber.error}
            format="### ####"
            onChange={() => {
              clearErrors(phoneNumber.clearErrors || phoneNumber.id)
            }}
            defaultValue={phoneNumber.defaultValue || ''}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ContactInfoRow
