import React, { FC } from 'react'
import {
  CheckboxField,
  Field,
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

const FormField: FC<{
  field: Field
  showFieldName?: boolean
  autoFocus?: boolean
}> = ({ autoFocus, field, showFieldName }) => {
  const { register } = useFormContext()

  if (field.type === FieldTypes.CHECKBOX) {
    return (
      <CheckboxFormField
        autoFocus={autoFocus}
        register={register}
        field={field as CheckboxField}
        showFieldName={showFieldName}
      />
    )
  } else if (field.type === FieldTypes.INTRO) {
    return (
      <IntroductionFormField
        field={field as IntroductionField}
        showFieldName={showFieldName}
      />
    )
  } else if (field.type === FieldTypes.RADIO) {
    return (
      <RadioFormField
        autoFocus={autoFocus}
        field={field as RadioField}
        register={register}
        showFieldName={showFieldName}
      />
    )
  } else if (field.type === FieldTypes.TEXT) {
    return (
      <TextFormField
        autoFocus={autoFocus}
        field={field as TextField}
        register={register}
        showFieldName={showFieldName}
      />
    )
  } else {
    return <p>We have not implemented this field yet {field.type}</p>
  }
}

export default FormField
