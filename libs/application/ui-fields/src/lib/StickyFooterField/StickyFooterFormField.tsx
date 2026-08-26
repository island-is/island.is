import {
  FieldBaseProps,
  FormValue,
  StickyFooterField,
} from '@island.is/application/types'
import { FC, useEffect, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import * as styles from './StickyFooterFormField.css'

interface Props extends FieldBaseProps {
  field: StickyFooterField
}

const BOTTOM_GAP = 16

export const StickyFooterFormField: FC<Props> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  const { control } = useFormContext()

  const watchedValues = useWatch({ name: field.watchFieldIds, control })
  const liveAnswers: Record<string, unknown> = Object.fromEntries(
    field.watchFieldIds.map((id, index) => [id, watchedValues[index]]),
  )
  const liveApplication = {
    ...application,
    answers: {
      ...application.answers,
      ...liveAnswers,
    } as FormValue,
  }

  const rows =
    typeof field.rows === 'function'
      ? field.rows(liveApplication)
      : field.rows

  const footerRef = useRef<HTMLElement>(null)

  const [state, setState] = useState<{
    isFloating: boolean
    left: number
    width: number
  } | null>(null)

  useEffect(() => {
    const target = document.querySelector(
      `[data-testid="${field.widthReferenceTestId}"]`,
    )
    if (!target) {
      return
    }

    let frame: number | null = null

    const updatePosition = () => {
      frame = null
      const targetRect = target.getBoundingClientRect()
      const footerHeight = footerRef.current?.offsetHeight ?? 0
      const floatingTopY = window.innerHeight - BOTTOM_GAP - footerHeight

      setState({
        isFloating: targetRect.bottom > floatingTopY,
        left: targetRect.left,
        width: targetRect.width,
      })
    }

    const scheduleUpdate = () => {
      if (frame === null) {
        frame = requestAnimationFrame(updatePosition)
      }
    }

    updatePosition()
    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(target)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (frame !== null) {
        cancelAnimationFrame(frame)
      }
      resizeObserver.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [field.widthReferenceTestId])

  if (!state) {
    return null
  }

  return (
    <Box
      ref={footerRef}
      position={state.isFloating ? 'fixed' : undefined}
      bottom={state.isFloating ? 2 : undefined}
      marginTop={state.isFloating ? undefined : 4}
      style={
        state.isFloating
          ? { left: state.left, width: state.width }
          : undefined
      }
    >
      <Box
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
        paddingBottom={1}
        borderRadius="large"
        className={
          state.isFloating
            ? `${styles.footer} ${styles.floatingShadow}`
            : styles.footer
        }
      >
        {rows.map((row, index) => (
          <Box
            key={`sticky-footer-row-${index}`}
            paddingTop={1}
            paddingBottom={1}
            className={styles.row}
          >
            <Text
              variant="medium"
              fontWeight={index === 0 ? 'semiBold' : 'regular'}
              className={styles.label}
            >
              {formatText(row.label, application, formatMessage)}
            </Text>
            <Text
              variant="medium"
              fontWeight={index === 0 ? 'semiBold' : 'regular'}
            >
              {formatText(row.value, application, formatMessage)}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
