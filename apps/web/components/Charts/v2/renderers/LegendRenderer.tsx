import { CSSProperties } from 'react'
import { DefaultLegendContentProps, Legend, LegendPayload } from 'recharts'

import { theme } from '@island.is/island-ui/theme'

import {
  ChartComponentWithRenderProps,
  ChartData,
  CustomStyleConfig,
} from '../types'
import { decideChartBase, formatPercentageForPresentation } from '../utils'
import { getPieData, getPieTotal } from './ChartComponentRenderer'

// Series colours are too light for text (purple300 is 2:1 on white), so the
// colour stays on the swatch and the label meets contrast
const renderLegendItemLabel = (value: string | undefined) => {
  return (
    <span
      style={{
        color: theme.color.dark400,
        fontSize: '16px',
      }}
    >
      {value}
    </span>
  )
}

const MOBILE_LIST_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  rowGap: '12px',
}

const PIE_SWATCH_SIZE = 16

// Mobile pies have no outside labels, so the legend names each segment
const renderPieLegend = (
  components: ChartComponentWithRenderProps[],
  data: ChartData,
) => {
  const pieData = getPieData(components, data)
  const total = getPieTotal(pieData)

  return (
    <ul style={MOBILE_LIST_STYLE}>
      {pieData.map((entry, index) => {
        // Matches the Cell order in renderPieChartComponents
        const component = components[index]

        return (
          <li
            key={`item-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              columnGap: '8px',
              width: '100%',
            }}
          >
            <svg
              width={PIE_SWATCH_SIZE}
              height={PIE_SWATCH_SIZE}
              style={{ flexShrink: 0 }}
            >
              <rect
                width={PIE_SWATCH_SIZE}
                height={PIE_SWATCH_SIZE}
                fill={component?.patternId ?? component?.color}
              />
            </svg>
            <span style={{ flex: 1 }}>{renderLegendItemLabel(entry.name)}</span>
            <span
              style={{
                color: theme.color.dark400,
                fontSize: '16px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              {formatPercentageForPresentation(
                total ? (entry.value ?? 0) / total : 0,
              )}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

interface CustomLegendRendererProps extends DefaultLegendContentProps {
  components: ChartComponentWithRenderProps[]
  data: ChartData
  customStyleConfig: CustomStyleConfig
  isMobile: boolean
  payload?: ReadonlyArray<
    LegendPayload & {
      payload?: {
        dataKey?: string
        stroke?: string
        strokeDasharray?: string | number
      }
    }
  >
}

const CustomLegendRenderer = (props: CustomLegendRendererProps) => {
  const { payload } = props

  if (!payload) {
    return null
  }

  const chartType = decideChartBase(props.components)

  if (chartType === 'pie') {
    return props.isMobile ? renderPieLegend(props.components, props.data) : null
  }

  return (
    <ul
      style={
        props.isMobile
          ? MOBILE_LIST_STYLE
          : {
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              columnGap: '15px',
              rowGap: '15px',
              justifyContent: 'center',
            }
      }
    >
      {payload.map((entry, index) => {
        const id = entry.payload?.dataKey
        const stroke = entry?.payload?.stroke

        const component = props.components.find((c) => c.sourceDataKey === id)

        // A full-size bar swatch reads as an extra bar in a narrow column
        const height =
          component?.type === 'bar' ? (props.isMobile ? 20 : 40) : 20
        const width =
          component?.type === 'bar' ? (props.isMobile ? 16 : 25) : 30

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
            {renderLegendItemLabel(entry.value)}
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
  isMobile: boolean
}

const DEFAULT_WRAPPER_STYLE = {
  paddingTop: '30px',
} as CSSProperties

export const renderLegend = ({
  componentsWithAddedProps,
  data,
  customStyleConfig,
  isMobile,
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
          customStyleConfig={customStyleConfig}
          isMobile={isMobile}
        />
      )}
    />
  )
}
