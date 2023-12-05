import {
  PREDEFINED_FILL_PATTERNS,
  PREDEFINED_PIE_FILL_PATTERNS,
} from '../constants'
import { ChartComponentWithRenderProps, ChartType, FillPattern } from '../types'

interface MultipleFillPatternRendererProps {
  components: ChartComponentWithRenderProps[]
  chartType: ChartType
}

export const renderMultipleFillPatterns = ({
  components,
  chartType,
}: MultipleFillPatternRendererProps) => {
  return (
    <defs>
      {components.map((c) =>
        c.hasFill
          ? renderSingleFillPattern({
              id: c.fill!.replace('url(#', '').replace(')', ''),
              color: c.color,
              type: (chartType === ChartType.pie
                ? PREDEFINED_PIE_FILL_PATTERNS
                : PREDEFINED_FILL_PATTERNS)[c.indexWithinType],
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

export const renderSingleFillPattern = (
  props: SingleFillPatternRendererProps,
) => {
  const { id, color, type } = props

  switch (type) {
    case FillPattern.diagonalSwToNe:
      return (
        <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="20" height="20" fill="white" />
          <rect
            x="0"
            y="0"
            width="20"
            height="20"
            fill={color}
            opacity={0.65}
          />
          <path
            d="M-10,10 L10,-10 M0,20 L20,0 M10,30 L30,10"
            stroke={color}
            strokeWidth="3"
          />
        </pattern>
      )
    case FillPattern.diagonalSeToNw:
      return (
        <pattern
          id={id}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(90)"
        >
          <rect x="0" y="0" width="20" height="20" fill="white" />
          <rect
            x="0"
            y="0"
            width="20"
            height="20"
            fill={color}
            opacity={0.65}
          />
          <path
            d="M-10,10 L10,-10 M0,20 L20,0 M10,30 L30,10"
            stroke={color}
            strokeWidth="3"
          />
        </pattern>
      )
    case FillPattern.diagonalSwToNeDense:
      return (
        <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="10" height="10" fill="white" />
          <rect
            x="0"
            y="0"
            width="10"
            height="10"
            fill={color}
            opacity={0.65}
          />
          <path
            d="M-5,5 L5,-5 M0,10 L10,0 M5,15 L15,5"
            stroke={color}
            strokeWidth="2"
          />
        </pattern>
      )
    case FillPattern.diagonalSeToNwDense:
      return (
        <pattern
          id={id}
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(90)"
        >
          <rect x="0" y="0" width="10" height="10" fill="white" />
          <rect
            x="0"
            y="0"
            width="10"
            height="10"
            fill={color}
            opacity={0.65}
          />
          <path
            d="M-5,5 L5,-5 M0,10 L10,0 M5,15 L15,5"
            stroke={color}
            strokeWidth="2"
          />
        </pattern>
      )
    case FillPattern.horizontal:
      return (
        <pattern
          id={id}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(23)"
        >
          <rect x="0" y="0" width="20" height="20" fill="white" />
          <rect
            x="0"
            y="0"
            width="20"
            height="20"
            fill={color}
            opacity={0.65}
          />
          <path
            d="M-10,10 L10,-10 M0,20 L20,0 M10,30 L30,10"
            stroke={color}
            strokeWidth="3"
          />
        </pattern>
      )
    case FillPattern.vertical:
      return (
        <pattern
          id={id}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(135)"
        >
          <rect x="0" y="0" width="20" height="20" fill="white" />
          <rect
            x="0"
            y="0"
            width="20"
            height="20"
            fill={color}
            opacity={0.65}
          />
          <path
            d="M-10,10 L10,-10 M0,20 L20,0 M10,30 L30,10"
            stroke={color}
            strokeWidth="3"
          />
        </pattern>
      )
    case FillPattern.dotsSmall:
      return (
        <pattern
          id={id}
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-25)"
        >
          <rect x="0" y="0" width="10" height="10" fill="white" />
          <rect x="0" y="0" width="10" height="10" fill={color} opacity={0.5} />
          <rect x={5} y={5} width={2} height={2} fill={color} />
        </pattern>
      )
    case FillPattern.dotsMedium:
      return (
        <pattern
          id={id}
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-25)"
        >
          <rect x="0" y="0" width="16" height="16" fill="white" />
          <rect x="0" y="0" width="16" height="16" fill={color} opacity={0.5} />
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
          patternTransform="rotate(-25)"
        >
          <rect x="0" y="0" width="16" height="16" fill="white" />
          <rect x="0" y="0" width="16" height="16" fill={color} opacity={0.6} />
          <circle cx={8} cy={8} r={4} fill={color} />
        </pattern>
      )

    default:
      return null
  }
}
