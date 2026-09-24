import { theme } from '@island.is/island-ui/theme'

import { wrapAxisLabel } from './wrapAxisLabel'

const LINE_HEIGHT = 14
const DEFAULT_MAX_CHARS_PER_LINE = 10
const DEFAULT_MAX_LINES = 3

interface WrappedAxisTickProps {
  x?: number
  y?: number
  payload?: { value?: string | number }
  textAnchor?: 'start' | 'middle' | 'end'
  fontSize?: number
  dy?: number
  maxCharsPerLine?: number
  maxLines?: number
}

export const WrappedAxisTick = ({
  x = 0,
  y = 0,
  payload,
  textAnchor = 'middle',
  fontSize = theme.typography.baseFontSize,
  dy = 16,
  maxCharsPerLine = DEFAULT_MAX_CHARS_PER_LINE,
  maxLines = DEFAULT_MAX_LINES,
}: WrappedAxisTickProps) => {
  const label = String(payload?.value ?? '')
  const lines = wrapAxisLabel(label, maxCharsPerLine, maxLines)

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      fontSize={fontSize}
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
