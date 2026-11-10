import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

export interface SpiderChartDataPoint {
  /** The category plotted on one axis of the spider. */
  label: string
  /** The value for that category. */
  value: number
}

export interface SpiderChartProps {
  /** One data point per axis. At least three are needed for a readable polygon. */
  data: SpiderChartDataPoint[]
  /**
   * The radial value range, e.g. `[0, 3]` for a 0-3 score. Defaults to
   * `[0, 'auto']` so Recharts scales to the data.
   */
  domain?: [number, number | 'auto']
  /** Number of concentric radius ticks. */
  tickCount?: number
  /** Pixel height of the responsive container. */
  height?: number
  /** Name of the series, shown in the tooltip next to each value. */
  name?: string
  /** Formats values in the tooltip and on the radius axis. */
  formatValue?: (value: number) => string
  /** Axis labels longer than this are truncated with an ellipsis (full text on hover). */
  maxLabelLength?: number
  /** Accessible label for the chart figure. */
  ariaLabel?: string
  /**
   * Radius of the plotted polygon as a share of the container, e.g. `'65%'`.
   * Lower it to give the category labels more room around the chart.
   */
  outerRadius?: number | string
  /**
   * Extra gap, in px, between the grid's outer ring and the category labels.
   * Raise it if the labels crowd the polygon.
   */
  labelOffset?: number

  /* --- Appearance (all optional, each defaults to the values below) --- */
  /** Color of the outline that connects the data points. */
  lineColor?: string
  /** Fill color of the area inside the outline. */
  fillColor?: string
  /** Opacity of the area fill, 0-1. Lower lets the grid show through. */
  fillOpacity?: number
  /** Color of the dot drawn at each data point. */
  dotColor?: string
  /** Radius of the dot drawn at each data point, in px. */
  dotSize?: number
  /**
   * Whether to show a value tooltip on hover. Radar charts often omit it, since
   * the shape is read at a glance and exact values usually live in a table.
   */
  showTooltip?: boolean
  /** Color of the polygon grid rings and spokes. */
  gridColor?: string
  /** Color of the radius scale numbers and their axis. */
  axisColor?: string
  /** Color of the category labels around the chart. */
  labelColor?: string
  /** Font size of the category labels, in px. */
  labelFontSize?: number
  /** Font weight of the category labels. Use 400 (the default) for regular, 600+ for bold. */
  labelFontWeight?: number | string
  /** Font family of the category labels. Defaults to the inherited island-ui font. */
  labelFontFamily?: string
}

const DEFAULT_MAX_LABEL_LENGTH = 20

interface CategoryTickProps {
  x?: number
  y?: number
  // Center of the chart, supplied by Recharts; used to push labels outward.
  cx?: number
  cy?: number
  textAnchor?: 'start' | 'middle' | 'end'
  payload?: { value: string }
  maxLabelLength?: number
  color?: string
  fontSize?: number
  fontWeight?: number | string
  fontFamily?: string
  labelOffset?: number
}

// Truncates long category labels but keeps the full text available through the
// native SVG <title> tooltip, so no label is ever lost. The font and color are
// driven by the props the chart passes down. The label is nudged radially
// outward by labelOffset so it clears the polygon's outer ring.
const CategoryTick = ({
  x = 0,
  y = 0,
  cx = 0,
  cy = 0,
  textAnchor = 'middle',
  payload,
  maxLabelLength = DEFAULT_MAX_LABEL_LENGTH,
  color,
  fontSize,
  fontWeight,
  fontFamily,
  labelOffset = 0,
}: CategoryTickProps) => {
  const value = payload?.value ?? ''
  const label =
    value.length > maxLabelLength
      ? `${value.slice(0, maxLabelLength - 1)}…`
      : value
  // Unit vector from the center out to this tick, scaled by labelOffset.
  const dx = x - cx
  const dy = y - cy
  const distance = Math.hypot(dx, dy) || 1
  const offsetX = x + (dx / distance) * labelOffset
  const offsetY = y + (dy / distance) * labelOffset
  return (
    <text
      x={offsetX}
      y={offsetY}
      textAnchor={textAnchor}
      fontSize={fontSize}
      fontWeight={fontWeight}
      fontFamily={fontFamily}
      fill={color}
    >
      {label}
      <title>{value}</title>
    </text>
  )
}

/**
 * A single-series spider (radar) chart built on Recharts. Plots one value per
 * category around a polygon grid, with a hover tooltip and label truncation.
 * Every color and the label font are overridable through props; the defaults
 * give a red series on a grey grid with navy dots.
 * Pair it with a heading that names the series and, where the data matters,
 * a table view for non-visual access.
 */
export const SpiderChart = ({
  data,
  domain = [0, 'auto'],
  tickCount,
  height = 540,
  name,
  formatValue,
  maxLabelLength = DEFAULT_MAX_LABEL_LENGTH,
  ariaLabel,
  outerRadius = '60%',
  labelOffset = 12,
  lineColor = theme.color.red400,
  fillColor = theme.color.red200,
  fillOpacity = 0.15,
  dotColor = theme.color.dark400,
  dotSize = 1,
  showTooltip = true,
  gridColor = theme.color.dark300,
  axisColor = theme.color.dark300,
  labelColor = theme.color.dark400,
  labelFontSize = 12,
  labelFontWeight = 400,
  labelFontFamily,
}: SpiderChartProps) => {
  if (!data || data.length === 0) {
    return null
  }

  return (
    <Box width="full" height="full" aria-label={ariaLabel} role="img">
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} outerRadius={outerRadius}>
          <PolarGrid gridType="polygon" stroke={gridColor} />
          <PolarAngleAxis
            dataKey="label"
            tick={
              <CategoryTick
                maxLabelLength={maxLabelLength}
                color={labelColor}
                fontSize={labelFontSize}
                fontWeight={labelFontWeight}
                fontFamily={labelFontFamily}
                labelOffset={labelOffset}
              />
            }
          />
          <PolarRadiusAxis
            angle={90}
            domain={domain}
            tickCount={tickCount}
            tickFormatter={formatValue}
            tick={{ fontSize: 12, fill: axisColor }}
            axisLine={false}
            stroke={axisColor}
          />
          {showTooltip && (
            <Tooltip
              formatter={(value) =>
                formatValue ? formatValue(Number(value)) : value
              }
            />
          )}
          <Radar
            name={name}
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            fill={fillColor}
            fillOpacity={fillOpacity}
            dot={{ r: dotSize, fill: dotColor, stroke: dotColor }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default SpiderChart
