import React, { ReactNode, useContext } from 'react'
import { RadioButton, Box } from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './RadioButtonContainer.css'

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

const RadioButtonContainer = ({
  options,
  className,
  error,
  onChange,
  isChecked,
}: RadioContainerProps) => {
  return options ? (
    <Box
      marginBottom={[1, 1, 2]}
      className={cn({
        [`${className}`]: true,
      })}
    >
      {options.map((item, index) => {
        return (
          <Box
            key={'radioButton-' + index}
            className={cn({
              [`${styles.marginTopItems}`]: index !== 0 && !className, //WIP bestu solution?
            })}
          >
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
            />
          </Box>
        )
      })}
    </Box>
  ) : null
}

export default RadioButtonContainer
