import { QuestionnaireOptionsLabelValue } from '@island.is/api/schema'
import { Box, Hyphen, Text } from '@island.is/island-ui/core'
import cn from 'classnames'
import React, { FC, useEffect, useMemo, useRef } from 'react'
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
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const shouldFocusAfterSelection = useRef(false)
  const uniqueId = React.useId()
  const labelId = `progress-label-${uniqueId}`
  const descriptionId = `progress-description-${uniqueId}`

  // Check if the selected value actually exists in this instance's options
  const hasValidSelection = useMemo(
    () =>
      !!(
        options &&
        selectedValue &&
        options.some((opt) => opt.value === selectedValue.value)
      ),
    [options, selectedValue],
  )

  // Calculate actual progress based on selected value if options exist
  const actualProgress = useMemo(() => {
    if (options && options.length > 0 && selectedValue) {
      const selectedIndex = options.findIndex(
        (opt) => opt.value === selectedValue.value,
      )
      if (selectedIndex >= 0) {
        return selectedIndex / (options.length - 1)
      }
    }
    return progress
  }, [options, selectedValue, progress])

  // Focus the selected button when selection changes (only for keyboard interactions)
  useEffect(() => {
    if (shouldFocusAfterSelection.current && options && selectedValue) {
      const selectedIndex = options.findIndex(
        (opt) => opt.value === selectedValue.value,
      )
      if (selectedIndex >= 0 && buttonRefs.current[selectedIndex]) {
        buttonRefs.current[selectedIndex]?.focus()
      }
      shouldFocusAfterSelection.current = false
    }
  }, [selectedValue, options])

  if (actualProgress > 1 || actualProgress < 0) {
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
    // First get relative coord by element, then divide by the element width for a percentage
    const clickWidthPercent =
      (event.clientX - boundingBox.left) / boundingBox.width
    onClick(clickWidthPercent)
  }

  return (
    <Box className={styles.container}>
      {label && (
        <Text variant="h5" marginBottom={2} id={labelId}>
          {HtmlParser(label)}
          {required && <span style={{ color: 'red' }}> *</span>}
        </Text>
      )}
      {options && options.length > 0 && (
        <Box
          component="span"
          id={descriptionId}
          className={styles.optionsDescription}
        >
          Use arrow keys to navigate between options. Press Enter or Space to
          select.
        </Box>
      )}
      <Box
        className={styles.progressContainer}
        role={options ? 'radiogroup' : 'group'}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={options ? descriptionId : undefined}
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
      >
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
          role={options ? undefined : 'slider'}
          aria-valuemin={options ? undefined : 0}
          aria-valuemax={options ? undefined : 100}
          aria-valuenow={options ? undefined : Math.round(actualProgress * 100)}
          aria-valuetext={
            options ? undefined : `${Math.round(actualProgress * 100)}%`
          }
          tabIndex={options ? -1 : 0}
        >
          {renderProgressBar && (
            <Box
              className={styles.inner}
              background={'blue400'}
              borderRadius="large"
              position="absolute"
              style={{
                transform: `translate${vertical ? 'Y' : 'X'}(${
                  (1 - actualProgress) * -100
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
                (isLast ? -2 : isFirst ? 2 : 0)

              // Make sure each radiogroup has exactly one tabbable option:
              // - If selection is valid → the selected one
              // - If selection is invalid or missing → the first option
              const isTabbable = isSelected || (!hasValidSelection && isFirst)

              return (
                <button
                  key={`dot-${option.value}`}
                  ref={(el) => {
                    buttonRefs.current[index] = el
                  }}
                  className={cn(styles.dot, styles.dotPosition, {
                    [styles.dotSelected]: isSelected,
                  })}
                  style={{
                    left: `${position}%`,
                  }}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={option.label}
                  tabIndex={isTabbable ? 0 : -1}
                  onClick={(e) => {
                    e.stopPropagation()
                    onOptionClick?.(option.value)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      onOptionClick?.(option.value)
                    } else if (
                      e.key === 'ArrowRight' ||
                      e.key === 'ArrowDown'
                    ) {
                      e.preventDefault()
                      shouldFocusAfterSelection.current = true
                      const nextIndex = Math.min(index + 1, options.length - 1)
                      onOptionClick?.(options[nextIndex].value)
                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                      e.preventDefault()
                      shouldFocusAfterSelection.current = true
                      const prevIndex = Math.max(index - 1, 0)
                      onOptionClick?.(options[prevIndex].value)
                    }
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
                (isLast ? -2 : isFirst ? 2 : 0)

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

            // Calculate max width based on number of options to prevent overlap
            const maxWidthPercent = 100 / options.length - 2 // -2% for spacing

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
                  maxWidth: `${maxWidthPercent}%`,
                }}
              >
                <Text variant="small" color="blue400" fontWeight="medium">
                  <Hyphen>{option.label}</Hyphen>
                </Text>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}
