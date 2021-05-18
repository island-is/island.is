import React, { ReactNode, useContext } from 'react'
import { RadioButton, Box } from '@island.is/island-ui/core'

interface RadioContainerProps {
  className?: string
  error?: boolean
  options: {
    label: string
    sublabel?: string
    type?: string | number | boolean
    value?: number | string
  }[]
  onChange?: any
  isChecked?: any
}

const RadioButtonContainer: React.FC<RadioContainerProps> = ({
  options,
  className,
  error,
  onChange,
  isChecked,
}) => {
  return options ? (
    <>
      {options.map((item, index) => {
        return (
          <Box marginBottom={[2, 2, 3]}>
            <RadioButton
              name={'options-' + index}
              label={item.label}
              subLabel={item.sublabel}
              value={item.value}
              hasError={error}
              checked={isChecked(item.value)}
              onChange={() => {
                onChange(item.value)
              }}
              large
              filled
            />
          </Box>
        )
      })}
    </>
  ) : null
}

export default RadioButtonContainer
