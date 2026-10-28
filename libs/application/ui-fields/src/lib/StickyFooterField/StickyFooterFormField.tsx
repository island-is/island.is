import {
  FieldBaseProps,
  FormValue,
  StickyFooterField,
} from '@island.is/application/types'
import { CSSProperties, FC, Fragment, useEffect, useRef, useState } from 'react'
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
    typeof field.rows === 'function' ? field.rows(liveApplication) : field.rows

  const footerRef = useRef<HTMLElement>(null)

  const [state, setState] = useState<{
    isFloating: boolean
    left: number
    width: number
    labelLeft: number | null
    valueLeft: number | null
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

      const scroller = target.querySelector('table')?.parentElement
      const overflows =
        !!scroller && scroller.scrollWidth > scroller.clientWidth
      const alignCells =
        field.alignToRowTestId && !overflows
          ? target.querySelectorAll<HTMLElement>(
              `[data-testid="${field.alignToRowTestId}"] td[data-column-index]`,
            )
          : []
      const textLeft = (cell?: HTMLElement) =>
        cell
          ? cell.getBoundingClientRect().left -
            targetRect.left +
            parseFloat(getComputedStyle(cell).paddingLeft)
          : null

      setState({
        isFloating: targetRect.bottom > floatingTopY,
        left: targetRect.left,
        width: targetRect.width,
        labelLeft: textLeft(alignCells[0]),
        valueLeft: textLeft(alignCells[alignCells.length - 1]),
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
  }, [field.widthReferenceTestId, field.alignToRowTestId])

  if (!state) {
    return null
  }

  if (!state.isFloating && field.alignToRowTestId) {
    const row = rows[0]

    return (
      <Box
        ref={footerRef}
        className={styles.inlineRow}
        style={
          {
            '--sticky-footer-label-left':
              state.labelLeft === null ? undefined : `${state.labelLeft}px`,
            '--sticky-footer-value-left':
              state.valueLeft === null ? undefined : `${state.valueLeft}px`,
          } as CSSProperties
        }
      >
        <Box className={styles.inlineLabelCell}>
          <Text truncate variant="medium" fontWeight="semiBold">
            {formatText(row.label, application, formatMessage)}
          </Text>
        </Box>
        <Box className={styles.inlineValueCell}>
          <Text variant="medium" fontWeight="semiBold" color="blue400">
            {formatText(row.value, application, formatMessage)}
          </Text>
        </Box>
      </Box>
    )
  }

  const gridStyle = {
    '--sticky-footer-label-indent':
      field.labelOffset === undefined ? undefined : `${field.labelOffset}px`,
    '--sticky-footer-label-min-width':
      field.labelMinWidth === undefined
        ? undefined
        : `${field.labelMinWidth}px`,
  } as CSSProperties

  return (
    <Box
      ref={footerRef}
      position={state.isFloating ? 'fixed' : undefined}
      bottom={state.isFloating ? 2 : undefined}
      marginTop={state.isFloating ? undefined : 4}
      style={
        state.isFloating ? { left: state.left, width: state.width } : undefined
      }
    >
      <Box
        borderRadius="large"
        style={gridStyle}
        className={
          state.isFloating
            ? `${styles.grid} ${styles.footer} ${styles.floatingShadow}`
            : `${styles.grid} ${styles.footer}`
        }
      >
        {rows.map((row, index) => (
          <Fragment key={`sticky-footer-row-${index}`}>
            <Box className={`${styles.cell} ${styles.labelCell}`}>
              <Text
                truncate
                variant="medium"
                fontWeight={index === 0 ? 'semiBold' : 'regular'}
              >
                {formatText(row.label, application, formatMessage)}
              </Text>
            </Box>
            <Box className={`${styles.cell} ${styles.valueCell}`}>
              <Text
                variant="medium"
                fontWeight={index === 0 ? 'semiBold' : 'regular'}
              >
                {formatText(row.value, application, formatMessage)}
              </Text>
            </Box>
          </Fragment>
        ))}
      </Box>
    </Box>
  )
}
