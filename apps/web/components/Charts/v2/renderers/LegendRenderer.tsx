import { CSSProperties } from 'react'
import { Legend, LegendProps } from 'recharts'

import { theme } from '@island.is/island-ui/theme'

import {
  ChartComponentWithRenderProps,
  ChartData,
  CustomStyleConfig,
} from '../types'
import { decideChartBase } from '../utils'

const renderLegendItemLabel = (
  value: string,
  component?: ChartComponentWithRenderProps,
) => {
  return (
    <span
      style={{
        color: component?.color ?? theme.color.dark400,
        fontSize: '16px',
      }}
    >
      {value}
    </span>
  )
}

type InferredArrayType<T> = T extends (infer U)[] ? U : never

interface CustomLegendRendererProps extends LegendProps {
  components: ChartComponentWithRenderProps[]
  data: ChartData
  customStyleConfig: CustomStyleConfig
  payload?:
    | (InferredArrayType<LegendProps['payload']> & {
        payload: {
          dataKey: string
          stroke: string
        }
      })[]
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
        justifyContent: 'center',
      }}
    >
      {payload.map((entry, index) => {
        const id = entry.payload?.dataKey
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
                  fill={component?.patternId ?? component?.color}
                />
              )}
            </svg>
            {renderLegendItemLabel(entry.value, component)}
          </li>
        )
      })}
    </ul>
  )
}

interface LegendRendererProps {
  componentsWithAddedProps: ChartComponentWithRenderProps[]
  data: ChartData
  customStyleConfig: CustomStyleConfig
}

const DEFAULT_WRAPPER_STYLE = {
  paddingTop: '30px',
} as CSSProperties

export const renderLegend = ({
  componentsWithAddedProps,
  data,
  customStyleConfig,
}: LegendRendererProps) => {
  if (componentsWithAddedProps.length <= 1) {
    return null
  }

  return (
    <Legend
      aria-hidden="true"
      verticalAlign={customStyleConfig.legend?.verticalAlign ?? undefined}
      wrapperStyle={
        customStyleConfig.legend?.wrapperStyle ?? DEFAULT_WRAPPER_STYLE
      }
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
