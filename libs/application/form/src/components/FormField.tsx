import React, { FC } from 'react'
import {
  CheckboxField,
  FieldTypes,
  IntroductionField,
  RadioField,
  TextField,
} from '@island.is/application/schema'
import { useFormContext } from 'react-hook-form'
import CheckboxFormField from '../fields/CheckboxFormField'
import IntroductionFormField from '../fields/IntroductionFormField'
import TextFormField from '../fields/TextFormField'
import RadioFormField from '../fields/RadioFormField'
import { FieldDef } from '../types'

const FormField: FC<{
  autoFocus?: boolean
  field: FieldDef
  showFieldName?: boolean
}> = ({ autoFocus, field, showFieldName }) => {
  const { register } = useFormContext()

  const fieldProps = {
    autoFocus,
    showFieldName,
    register,
  }

  if (!field.isVisible) {
    return null
  }

  if (field.type === FieldTypes.INTRO) {
    return (
      <IntroductionFormField
        field={field as IntroductionField}
        showFieldName={showFieldName}
      />
    )
  } else if (field.type === FieldTypes.CHECKBOX) {
    return <CheckboxFormField field={field as CheckboxField} {...fieldProps} />
  } else if (field.type === FieldTypes.RADIO) {
    return <RadioFormField field={field as RadioField} {...fieldProps} />
  } else if (field.type === FieldTypes.TEXT) {
    return <TextFormField field={field as TextField} {...fieldProps} />
  } else {
    return <p>We have not implemented this field yet {field.type}</p>
  }
}

export default FormField
