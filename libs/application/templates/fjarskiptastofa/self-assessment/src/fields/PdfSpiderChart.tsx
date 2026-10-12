import { FC } from 'react'
import {
  Circle,
  Line,
  Polygon,
  Svg,
  Text as SvgText,
} from '@react-pdf/renderer'
import { theme } from '@island.is/island-ui/theme'

export interface PdfSpiderChartDataPoint {
  label: string
  value: number
}

interface PdfSpiderChartProps {
  data: PdfSpiderChartDataPoint[]
  /** Radial value range, matching the on-screen chart's domain. */
  domain?: [number, number]
  /** Number of concentric grid rings (including the outer one). */
  tickCount?: number
  /** Canvas width in pt. Wider than it is tall to give side labels room. */
  width?: number
  /** Canvas height in pt. */
  height?: number
  /** Formats the radius scale numbers. */
  formatValue?: (value: number) => string
  /** Characters per label line before wrapping; a label wraps onto at most two. */
  maxLineLength?: number
}

const round = (n: number) => Math.round(n * 100) / 100

// Wraps a label onto at most two lines by whole words, so long category names
// stay inside the canvas instead of being clipped. A single word longer than a
// line is hard-split, and anything past two lines is cut with an ellipsis.
const wrapLabel = (value: string, maxLineLength: number): string[] => {
  const words = value.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length <= maxLineLength) {
      current = candidate
      continue
    }
    if (current) lines.push(current)
    if (word.length > maxLineLength) {
      current = `${word.slice(0, maxLineLength - 1)}…`
    } else {
      current = word
    }
    if (lines.length === 2) break
  }
  if (current && lines.length < 2) lines.push(current)

  if (lines.length === 2 && lines[1].length > maxLineLength) {
    lines[1] = `${lines[1].slice(0, maxLineLength - 1)}…`
  }
  return lines.slice(0, 2)
}

// A single-series spider (radar) chart drawn with @react-pdf/renderer SVG
// primitives, so it renders during PDF generation without a DOM or canvas. It
// mirrors the on-screen recharts SpiderChart: a red polygon over a grey polygon
// grid with navy dots and category labels around the outside.
const LINE_HEIGHT = 9
const LABEL_FONT_SIZE = 8

export const PdfSpiderChart: FC<PdfSpiderChartProps> = ({
  data,
  domain = [0, 3],
  tickCount = 5,
  width = 490,
  height = 430,
  formatValue = (value) => String(value),
  maxLineLength = 16,
}) => {
  // A polygon needs at least three axes to read as a spider chart.
  if (data.length < 3) {
    return null
  }

  const [min, max] = domain
  const span = max - min || 1
  const rings = Math.max(tickCount - 1, 1)

  const cx = width / 2
  const cy = height / 2
  // Base the grid radius on the shorter dimension so the labels keep room on
  // every side, with a little extra off the height for the top/bottom labels.
  const radius = Math.min(width, height) * 0.3
  const labelOffset = 14

  const angleFor = (index: number) =>
    -Math.PI / 2 + (index * 2 * Math.PI) / data.length

  const pointAt = (index: number, r: number): [number, number] => {
    const angle = angleFor(index)
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
  }

  const valueRadius = (value: number) => {
    const clamped = Math.max(min, Math.min(max, value))
    return ((clamped - min) / span) * radius
  }

  const polygonPoints = (r: number) =>
    data
      .map((_, index) => pointAt(index, r).map(round).join(','))
      .join(' ')

  const dataPoints = data.map((point, index) =>
    pointAt(index, valueRadius(point.value)),
  )
  const dataPolygon = dataPoints.map((p) => p.map(round).join(',')).join(' ')

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Concentric grid rings */}
      {Array.from({ length: rings }, (_, ring) => {
        const r = (radius * (ring + 1)) / rings
        return (
          <Polygon
            key={`ring-${ring}`}
            points={polygonPoints(r)}
            fill="none"
            stroke={theme.color.dark300}
            strokeWidth={0.5}
          />
        )
      })}

      {/* Spokes from the center out to each axis */}
      {data.map((_, index) => {
        const [x, y] = pointAt(index, radius)
        return (
          <Line
            key={`spoke-${index}`}
            x1={cx}
            y1={cy}
            x2={round(x)}
            y2={round(y)}
            stroke={theme.color.dark300}
            strokeWidth={0.5}
          />
        )
      })}

      {/* Radius scale numbers along the top axis */}
      {Array.from({ length: rings }, (_, ring) => {
        const r = (radius * (ring + 1)) / rings
        const value = min + (span * (ring + 1)) / rings
        return (
          <SvgText
            key={`tick-${ring}`}
            x={cx + 3}
            y={round(cy - r + 3)}
            fill={theme.color.dark300}
            style={{ fontSize: 7 }}
          >
            {formatValue(value)}
          </SvgText>
        )
      })}

      {/* Data area and outline */}
      <Polygon
        points={dataPolygon}
        fill={theme.color.red200}
        fillOpacity={0.15}
        stroke={theme.color.red400}
        strokeWidth={1.5}
      />

      {/* Dots at each data point */}
      {dataPoints.map(([x, y], index) => (
        <Circle
          key={`dot-${index}`}
          cx={round(x)}
          cy={round(y)}
          r={1.5}
          fill={theme.color.dark400}
        />
      ))}

      {/* Category labels around the outside, wrapped onto up to two lines */}
      {data.map((point, index) => {
        const [x, y] = pointAt(index, radius + labelOffset)
        const angle = angleFor(index)
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        const textAnchor =
          cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle'
        const lines = wrapLabel(point.label, maxLineLength)

        // Anchor the label block so top labels sit above the axis end, bottom
        // labels below it, and side labels centre on it.
        const startY =
          sin < -0.3
            ? y - (lines.length - 1) * LINE_HEIGHT
            : sin > 0.3
            ? y + LABEL_FONT_SIZE
            : y - ((lines.length - 1) / 2) * LINE_HEIGHT + 3

        return lines.map((line, lineIndex) => (
          <SvgText
            key={`label-${index}-${lineIndex}`}
            x={round(x)}
            y={round(startY + lineIndex * LINE_HEIGHT)}
            textAnchor={textAnchor}
            fill={theme.color.dark400}
            style={{ fontSize: LABEL_FONT_SIZE }}
          >
            {line}
          </SvgText>
        ))
      })}
    </Svg>
  )
}

export default PdfSpiderChart
