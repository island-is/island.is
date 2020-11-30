import React, { FC } from 'react'
import cs from 'classnames'
import { useFormContext, Controller } from 'react-hook-form'

import {
  Box,
  RadioButton,
  Stack,
  Tooltip,
  useNegativeMarginTop,
  useNegativeMarginLeft,
} from '@island.is/island-ui/core'

import * as styles from './RadioController.treat'

interface Option {
  value: string
  label: string
  tooltip?: string
  excludeOthers?: boolean
}
interface Props {
  defaultValue?: string[]
  disabled?: boolean
  error?: string
  id: string
  name?: string
  options?: Option[]
  largeButtons?: boolean
  halve?: boolean
  emphasize?: boolean
  onSelect?: (s: string) => void
}
export const RadioController: FC<Props> = ({
  defaultValue,
  disabled = false,
  error,
  id,
  name = id,
  options = [],
  halve = false,
  largeButtons = false,
  emphasize = false,
  onSelect = () => undefined,
}) => {
  const { clearErrors, setValue } = useFormContext()
  const topSpace = 2
  const leftSpace = 3
  const negativeMarginTop = useNegativeMarginTop(topSpace)
  const negativeMarginLeft = useNegativeMarginLeft(leftSpace)

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ value, onChange }) => {
        const renderRadioButton = (
          render: (_: React.ReactNode) => JSX.Element = (child) => <>{child}</>,
        ) =>
          options.map((option, index) =>
            render(
              <RadioButton
                large={largeButtons || emphasize}
                filled={emphasize}
                tooltip={option.tooltip}
                key={`${id}-${index}`}
                onChange={({ target }) => {
                  clearErrors(id)
                  onChange(target.value)
                  onSelect(target.value)
                  setValue(id, target.value)
                }}
                checked={option.value === value}
                id={`${id}-${index}`}
                name={`${id}`}
                label={option.label}
                value={option.value}
                disabled={disabled}
                errorMessage={index === options.length - 1 ? error : undefined}
                hasError={error !== undefined}
              />,
            ),
          )

        if (halve) {
          return (
            <Box
              display="flex"
              flexWrap="wrap"
              flexDirection="row"
              className={cs(negativeMarginTop, negativeMarginLeft)}
            >
              {renderRadioButton((child) => (
                <Box
                  paddingLeft={leftSpace}
                  paddingTop={topSpace}
                  className={styles.coverHalf}
                >
                  {child}
                </Box>
              ))}
            </Box>
          )
        } else {
          return <Stack space={topSpace}>{renderRadioButton()}</Stack>
        }
      }}
    />
  )
}

export default RadioController
