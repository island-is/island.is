import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { CheckboxController } from '@island.is/shared/form-fields'

interface Option {
  value: string
  label: string
}

interface Props {
  id: string
  children: React.ReactNode
  options: Option[]
  error?: string
  disabled?: boolean
}

const Terms = ({ id, children, disabled, error, options }: Props) => {
  return (
    <>
      <Box marginTop={3}>{children}</Box>
      <Box marginTop={6}>
        <CheckboxController
          id={id}
          disabled={disabled}
          name={`${id}`}
          error={error}
          large={true}
          defaultValue={[]}
          options={options}
        />
      </Box>
    </>
  )
}

export default Terms
