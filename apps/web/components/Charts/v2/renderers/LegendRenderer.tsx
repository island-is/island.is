import { Legend, LegendProps } from 'recharts'
import isNumber from 'lodash/isNumber'

import { ChartComponentWithRenderProps, ChartData } from '../types'
import { decideChartBase } from '../utils'

const renderLegendItemLabel = (value: string, entry?: any) => {
  const { payload } = entry

  return (
    <span
      style={{
        color: payload.stroke,
        fontSize: '16px',
      }}
    >
      {value}
    </span>
  )
}

interface CustomLegendRendererProps extends LegendProps {
  components: ChartComponentWithRenderProps[]
  data: ChartData
}

const CustomLegendRenderer = (props: CustomLegendRendererProps) => {
  const { payload } = props

  if (!payload) {
    return null
  }

  const chartType = decideChartBase(props.components)

  if (chartType === 'pie') {
    return null
  }

  return (
    <ul
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: '15px',
        rowGap: '15px',
        marginTop: '30px',
        justifyContent: 'center',
      }}
    >
      {payload.map((entry, index) => {
        // eslint-disable-next-line
        // @ts-ignore yes it exists
        const id = entry.payload!.dataKey!
        // eslint-disable-next-line
        // @ts-ignore yes it exists
        const stroke = entry?.payload?.stroke

        const component = props.components.find((c) => c.sourceDataKey === id)

        const height = component?.type === 'bar' ? 40 : 20
        const width = component?.type === 'bar' ? 25 : 30

        return (
          <li
            key={`item-${index}`}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <svg
              width={width}
              height={height}
              style={{
                margin: '0 5px',
                borderTopLeftRadius:
                  component?.type === 'bar' ? '6px' : 'unset',
                borderTopRightRadius:
                  component?.type === 'bar' ? '6px' : 'unset',
              }}
            >
              {component?.type === 'line' ? (
                <line
                  x1={0}
                  y1={height / 2}
                  x2={width}
                  y2={height / 2}
                  strokeWidth={4}
                  strokeDasharray={entry?.payload?.strokeDasharray}
                  stroke={stroke}
                />
              ) : (
                <rect
                  x="0"
                  y="0"
                  width={width}
                  height={height}
                  fill={
                    component?.type === 'area' ? component.fill : entry.color
                  }
                />
              )}
            </svg>
            {renderLegendItemLabel(entry.value, entry)}
          </li>
        )
      })}
    </ul>
  )
}

interface LegendRendererProps {
  componentsWithAddedProps: ChartComponentWithRenderProps[]
  data: ChartData
}

export const renderLegend = ({
  componentsWithAddedProps,
  data,
}: LegendRendererProps) => {
  return (
    <Legend
      aria-hidden="true"
      content={(props) => (
        <CustomLegendRenderer
          {...props}
          // eslint-disable-next-line
          // @ts-ignore
          height={props.height}
          components={componentsWithAddedProps}
          data={data}
        />
      )}
    />
  )
}
