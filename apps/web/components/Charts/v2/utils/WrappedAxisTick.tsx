import { theme } from '@island.is/island-ui/theme'

import { wrapAxisLabel } from './wrapAxisLabel'

// Relative to the tick's font size so a larger font can't overlap lines
const LINE_HEIGHT = '1.2em'
const DEFAULT_MAX_CHARS_PER_LINE = 10
const DEFAULT_MAX_LINES = 3

interface WrappedAxisTickProps {
  x?: number
  y?: number
  payload?: { value?: string | number }
  index?: number
  // Injected by Recharts when cloning a custom tick element
  tickFormatter?: (value: unknown, index: number) => string
  textAnchor?: 'start' | 'middle' | 'end'
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
  fontSize = theme.typography.baseFontSize,
  style,
  dy = 16,
  maxCharsPerLine = DEFAULT_MAX_CHARS_PER_LINE,
  maxLines = DEFAULT_MAX_LINES,
}: WrappedAxisTickProps) => {
  const label = String(
    (tickFormatter ? tickFormatter(payload?.value, index) : payload?.value) ??
      '',
  )
  const lines = wrapAxisLabel(label, maxCharsPerLine, maxLines)

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      // The axis forwards customStyleConfig's font size through `style`
      fontSize={style?.fontSize ?? fontSize}
      fontFamily={theme.typography.fontFamily}
      fill={theme.color.dark400}
    >
      {lines.map((line, i) => (
        <tspan key={line + i} x={x} dy={i === 0 ? dy : LINE_HEIGHT}>
          {line}
        </tspan>
      ))}
    </text>
  )
}
