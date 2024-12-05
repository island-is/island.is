import { AxisTickProps } from './AxisTick'

export const CustomizedRightAxisTick = ({ x, y, payload }: AxisTickProps) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    <g transform={`translate(${x + 10},${y - 10})`}>
      <text dy={16} textAnchor="start" fill="#00003C">
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          payload.value
        }
      </text>
    </g>
  )
}
