import { QuestionnaireOptionsLabelValue } from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'
import cn from 'classnames'
import React, { FC, useRef } from 'react'
import HtmlParser from 'react-html-parser'
import * as styles from './ProgressBar.css'

interface Props {
  progress: number
  label?: string
  className?: string
  variant?: boolean
  onClick?: (percentage?: number) => void
  renderProgressBar?: boolean
  vertical?: boolean
  selectedValue?: QuestionnaireOptionsLabelValue | undefined
  onOptionClick?: (value: string) => void
  options?: {
    label: string
    value: string
  }[]
  required?: boolean
}

export const ProgressBar: FC<Props> = ({
  progress,
  label,
  className,
  variant,
  onClick,
  options,
  renderProgressBar = true,
  vertical = false,
  selectedValue,
  onOptionClick,
  required = false,
}) => {
  const ref = useRef<HTMLElement>(null)

  if (progress > 1 || progress < 0) {
    return null
  }

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (!onClick) {
      return
    }
    const boundingBox = ref.current?.getBoundingClientRect()

    if (!boundingBox) {
      return
    }
    //First get relative coord by element, then divide by the element width for a percentage
    const clickWidthPercent =
      (event.clientX - boundingBox.left) / boundingBox.width
    onClick(clickWidthPercent)
  }

  return (
    <Box className={styles.container}>
      {label && (
        <Text variant="h5" marginBottom={2}>
          {HtmlParser(label)}
          {required && <span style={{ color: 'red' }}> *</span>}
        </Text>
      )}
      <Box className={styles.progressContainer}>
        <Box
          className={cn(styles.progress, className, {
            [styles.vertical]: vertical,
          })}
          position="relative"
          overflow="hidden"
          borderRadius="large"
          background={variant ? 'white' : options ? 'blue200' : 'blue100'}
          width="full"
          onClick={handleClick}
          ref={ref}
        >
          {renderProgressBar && (
            <Box
              className={styles.inner}
              background={'blue400'}
              borderRadius="large"
              position="absolute"
              style={{
                transform: `translate${vertical ? 'Y' : 'X'}(${
                  (1 - progress) * -100
                }%)`,
              }}
            />
          )}

          {/* Dots for each option */}
          {options &&
            options.length > 0 &&
            options.map((option, index) => {
              const isSelected = selectedValue?.value === option.value
              const isLast = index === options.length - 1
              const isFirst = index === 0
              const position =
                (index / (options.length - 1)) * 100 +
                (isLast ? -1 : isFirst ? 1 : 0)

              return (
                <Box
                  key={`dot-${option.value}`}
                  className={cn(styles.dot, styles.dotPosition, {
                    [styles.dotSelected]: isSelected,
                  })}
                  style={{
                    left: `${position}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onOptionClick?.(option.value)
                  }}
                />
              )
            })}
        </Box>
        {/* Selected indicator - positioned outside overflow hidden container */}
        {options && options.length > 0 && selectedValue && (
          <Box className={styles.selectedIndicatorContainer}>
            {options.map((option, index) => {
              if (selectedValue.value !== option.value) return null

              const isLast = index === options.length - 1
              const isFirst = index === 0
              const position =
                (index / (options.length - 1)) * 100 +
                (isLast ? -1 : isFirst ? 1 : 0)

              return (
                <Box
                  key={`indicator-${option.value}`}
                  className={styles.selectedIndicator}
                  style={{
                    left: `${position}%`,
                  }}
                >
                  <Box className={styles.selectedIndicatorInner} />
                </Box>
              )
            })}
          </Box>
        )}
      </Box>

      {options && options.length > 0 && (
        <Box className={styles.textContainer} marginTop={1}>
          {options.map((option, index) => {
            const isFirst = index === 0
            const isLast = index === options.length - 1
            const isMiddle = !isFirst && !isLast

            // For middle items, use dot position; for first/last, use edge positions
            const position = isMiddle
              ? (index / (options.length - 1)) * 100
              : (index / options.length) * 100

            const textAlign = isLast ? 'right' : 'left'

            return (
              <Box
                key={option.value}
                className={cn(styles.options, styles.textPosition, {
                  [styles.textMiddle]: isMiddle,
                  [styles.textFirst]: isFirst,
                  [styles.textLast]: isLast,
                })}
                textAlign={isMiddle ? 'center' : textAlign}
                style={{
                  left: `${position}%`,
                }}
              >
                <Text variant="small" color="blue400">
                  {option.label}
                </Text>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}
