import { FILL_BACKGROUND_MAIN_COLOR_OPACITY } from '../constants'
import { ChartComponentWithRenderProps, FillPattern } from '../types'

interface MultipleFillPatternRendererProps {
  components: ChartComponentWithRenderProps[]
}

export const renderMultipleFillPatterns = ({
  components,
}: MultipleFillPatternRendererProps) => {
  return (
    <defs>
      {components.map((c) =>
        c.patternId && c.pattern
          ? renderSingleFillPattern({
              id: c.patternId.replace('url(#', '').replace(')', ''),
              color: c.color,
              type: c.pattern as FillPattern,
            })
          : null,
      )}
    </defs>
  )
}

interface SingleFillPatternRendererProps {
  id: string
  color: string
  type: FillPattern
}

interface LinePatternProps {
  id: string
  color: string
  rotation?: number
  width?: number
}

const LinePattern = ({ id, color, rotation }: LinePatternProps) => (
  <pattern
    id={id}
    width="6"
    height="10"
    patternUnits="userSpaceOnUse"
    patternTransform={`rotate(${rotation ?? 0})`}
  >
    <rect x="0" y="0" width="6" height="10" fill="white" />
    <rect
      x="0"
      y="0"
      width="6"
      height="10"
      fill={color}
      fillOpacity={FILL_BACKGROUND_MAIN_COLOR_OPACITY}
    />
    <line x1="1" y1="0" x2="1" y2="10" stroke={color} strokeWidth="4" />
  </pattern>
)

export const renderSingleFillPattern = (
  props: SingleFillPatternRendererProps,
) => {
  const { id, color, type } = props

  switch (type) {
    case FillPattern.diagonalSwToNe:
      return <LinePattern id={id} color={color} rotation={45} />
    case FillPattern.diagonalSeToNw:
      return <LinePattern id={id} color={color} rotation={-45} />
    case FillPattern.horizontal:
      return <LinePattern id={id} color={color} rotation={45} />
    case FillPattern.vertical:
      return <LinePattern id={id} color={color} rotation={90} />

    case FillPattern.dotsSmall:
      return (
        <pattern
          id={id}
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <rect x="0" y="0" width="10" height="10" fill="white" />
          <rect
            x="0"
            y="0"
            width="10"
            height="10"
            fill={color}
            fillOpacity={FILL_BACKGROUND_MAIN_COLOR_OPACITY}
          />
          <rect x={5} y={5} width={2} height={2} fill={color} />
        </pattern>
      )
    case FillPattern.dotsMedium:
      return (
        <pattern
          id={id}
          width="12"
          height="12"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <rect x="0" y="0" width="16" height="16" fill="white" />
          <rect
            x="0"
            y="0"
            width="16"
            height="16"
            fill={color}
            fillOpacity={FILL_BACKGROUND_MAIN_COLOR_OPACITY}
          />
          <circle cx={8} cy={8} r={2} fill={color} />
        </pattern>
      )
    case FillPattern.dotsLarge:
      return (
        <pattern
          id={id}
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <rect x="0" y="0" width="16" height="16" fill="white" />
          <rect
            x="0"
            y="0"
            width="16"
            height="16"
            fill={color}
            fillOpacity={FILL_BACKGROUND_MAIN_COLOR_OPACITY}
          />
          <circle cx={8} cy={8} r={4} fill={color} />
        </pattern>
      )
    case FillPattern.chevron:
      return (
        <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="10" height="10" fill="white" />
          <rect
            x="0"
            y="0"
            width="10"
            height="10"
            fill={color}
            fillOpacity={FILL_BACKGROUND_MAIN_COLOR_OPACITY}
          />
          <path
            stroke={color}
            strokeLinecap="square"
            strokeWidth="3"
            d="M0,8 L5,2"
          />
          <path
            stroke={color}
            strokeLinecap="square"
            strokeWidth="3"
            d="M5,2 L10,8"
          />
        </pattern>
      )

    default:
      return null
  }
}
