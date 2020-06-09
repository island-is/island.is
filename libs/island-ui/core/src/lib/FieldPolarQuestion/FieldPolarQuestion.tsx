import React from 'react'
import { FormikState, FieldInputProps } from 'formik'
import { get } from 'lodash'
import { Checkbox } from '../Checkbox/Checkbox'
import { Typography } from '../..'
import InputError from '../InputError/InputError'
import { Box } from '../Box/Box'
import Tooltip from '../Tooltip/Tooltip'

export interface FieldPolarQuestionProps {
  label?: string
  positiveLabel?: string
  negativeLabel?: string
  reverse?: boolean
  tooltip?: string
  field?: FieldInputProps<boolean>
  form?: FormikState<string | number>
}

const CheckboxMapped = ({
  field,
  value,
  onChange,
  ariaError,
  idPostfix,
  fixedValue,
  label,
}) => (
  <Checkbox
    {...field}
    label={label}
    id={`${field.name}${idPostfix}`}
    checked={value === fixedValue}
    onChange={() => {
      onChange({
        target: {
          name: field.name,
          value: fixedValue,
        },
      })
    }}
    {...ariaError}
  />
)

export const FieldPolarQuestion = ({
  label,
  positiveLabel,
  negativeLabel,
  reverse,
  tooltip,
  field: { onChange, value, ...field },
  form: { touched, errors },
}: FieldPolarQuestionProps) => {
  const nameArray = (field.name && field.name.split('.')) || []
  const hasError = !!(get(touched, nameArray) && get(errors, nameArray))
  const errorMessage = get(errors, nameArray)
  const ariaError = hasError
    ? {
        'aria-invalid': true,
        'aria-describedby': field.name,
      }
    : {}
  const checkboxProps = {
    field,
    value,
    onChange,
    ariaError,
  }
  const posCheckbox = {
    idPostfix: '-pos',
    fixedValue: true,
    label: positiveLabel,
  }
  const negCheckbox = {
    idPostfix: '-neg',
    fixedValue: false,
    label: negativeLabel,
  }

  return (
    <Box>
      <Box marginBottom={2}>
        <Typography variant="h4" as="span">
          {label}{' '}
          <Box marginLeft={2} display="inlineBlock">
            <Tooltip text={tooltip} />
          </Box>
        </Typography>
      </Box>
      <Box marginRight={4} display="inlineBlock">
        <CheckboxMapped
          {...checkboxProps}
          {...(reverse ? negCheckbox : posCheckbox)}
        />
      </Box>
      <Box display="inlineBlock">
        <CheckboxMapped
          {...checkboxProps}
          {...(!reverse ? negCheckbox : posCheckbox)}
        />
      </Box>

      {hasError && errorMessage && (
        <InputError id={field.name} errorMessage={errorMessage} />
      )}
    </Box>
  )
}

export default FieldPolarQuestion
