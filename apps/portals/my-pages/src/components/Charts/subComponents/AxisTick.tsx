export interface AxisTickProps {
  x?: number
  y?: number
  className?: string
  payload?: { value: string }
}

export const CustomizedAxisTick = ({
  x,
  y,
  className,
  payload,
}: AxisTickProps) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const xAxis = className.includes('xAxis')
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={xAxis ? 16 : -17}
        y={xAxis ? 20 : -10}
        dy={16}
        textAnchor="end"
        fill="#00003C"
      >
        {payload?.value} {xAxis}
      </text>
    </g>
  )
}
