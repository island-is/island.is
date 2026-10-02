import { useMemo } from 'react'

import { theme } from '@island.is/island-ui/theme'
import { useI18n } from '@island.is/web/i18n'

import { wrapAxisLabel } from './wrapAxisLabel'

// Relative to the tick's font size so a larger font can't overlap lines
const LINE_HEIGHT_EM = 1.2
const LINE_HEIGHT = `${LINE_HEIGHT_EM}em`
// Matches Recharts' Text default for a start-anchored label
const CAP_HEIGHT_EM = 0.71
const CAP_HEIGHT = `${CAP_HEIGHT_EM}em`
// Room below the last baseline for descenders such as g, j and þ
const DESCENT_EM = 0.3
// Recharts' default tickSize (6) plus tickMargin (2)
const TICK_OFFSET = 8
const DEFAULT_MAX_CHARS_PER_LINE = 10
const DEFAULT_MAX_LINES = 3

// X-axis height that fits a label wrapped to the maximum number of lines
export const getWrappedXAxisHeight = (fontSize: number, dy: number) =>
  Math.ceil(
    TICK_OFFSET +
      dy +
      (CAP_HEIGHT_EM + (DEFAULT_MAX_LINES - 1) * LINE_HEIGHT_EM + DESCENT_EM) *
        fontSize,
  )

interface WrappedAxisTickProps {
  x?: number
  y?: number
  payload?: { value?: string | number }
  index?: number
  // Injected by Recharts when cloning a custom tick element
  tickFormatter?: (value: unknown, index: number) => string
  textAnchor?: 'start' | 'middle' | 'end'
  verticalAnchor?: 'start' | 'middle' | 'end'
  fontSize?: number
  style?: { fontSize?: number | string }
  dy?: number
  maxCharsPerLine?: number
  maxLines?: number
}

export const WrappedAxisTick = ({
  x = 0,
  y = 0,
  payload,
  index = 0,
  tickFormatter,
  textAnchor = 'middle',
  verticalAnchor,
  fontSize = theme.typography.baseFontSize,
  style,
  dy = 16,
  maxCharsPerLine = DEFAULT_MAX_CHARS_PER_LINE,
  maxLines = DEFAULT_MAX_LINES,
}: WrappedAxisTickProps) => {
  const { activeLocale } = useI18n()
  const label = String(
    (tickFormatter ? tickFormatter(payload?.value, index) : payload?.value) ??
      '',
  )
  // hyphenateText builds a new pattern table per call, so skip it on re-renders
  const lines = useMemo(
    () => wrapAxisLabel(label, maxCharsPerLine, maxLines, activeLocale),
    [label, maxCharsPerLine, maxLines, activeLocale],
  )
  const isTruncated = lines[lines.length - 1]?.endsWith('…') ?? false

  // Recharts sets a middle anchor on Y-axis ticks; center the block on the bar.
  // A start anchor gets Recharts' cap height so wrapped and unwrapped labels align
  const firstLineOffset =
    verticalAnchor === 'middle'
      ? `${(-(lines.length - 1) * LINE_HEIGHT_EM) / 2}em`
      : verticalAnchor === 'start'
      ? CAP_HEIGHT
      : 0

  return (
    <text
      x={x}
      y={y + dy}
      textAnchor={textAnchor}
      // The axis forwards customStyleConfig's font size through `style`
      fontSize={style?.fontSize ?? fontSize}
      fontFamily={theme.typography.fontFamily}
      fill={theme.color.dark400}
    >
      {isTruncated && <title>{label}</title>}
      {lines.map((line, i) => (
        <tspan
          key={line + i}
          x={x}
          dy={i === 0 ? firstLineOffset : LINE_HEIGHT}
        >
          {line}
        </tspan>
      ))}
    </text>
  )
}
