import { Tooltip, TooltipProps } from 'recharts'

import { theme } from '@island.is/island-ui/theme'
import { Chart } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'

import { ChartComponentWithRenderProps } from '../../types'
import { formatValueForPresentation } from '../../utils'
import * as style from './TooltipRenderer.css'

interface ExtraTooltipProps {
  slice: Chart
  componentsWithAddedProps: ChartComponentWithRenderProps[]
  tickFormatter: (value: unknown) => string
}

type CustomTooltipProps = TooltipProps<string, number> & ExtraTooltipProps

export const CustomTooltipRenderer = (props: CustomTooltipProps) => {
  const { active, payload } = props
  const isActive = active && payload && payload.length

  const { activeLocale } = useI18n()

  if (!isActive) {
    return null
  }

  return (
    <div className={style.tooltip}>
      {props.label && (
        <p className={style.tooltipLabel}>
          {props?.tickFormatter(props.label) ?? props.label}
        </p>
      )}
      <ul>
        {payload.map((item, i) => {
          const key = item?.payload?.key ?? item.dataKey
          let labelColor = theme.color.dark400

          if (key) {
            const component = props.componentsWithAddedProps.find(
              (c) => c.sourceDataKey === key,
            )

            if (component) {
              labelColor = component.color
            }
          }

          if (labelColor === 'white' || labelColor === '#fff') {
            labelColor = theme.color.blue400
          }

          return (
            <li>
              <span
                style={{
                  color: labelColor,
                }}
              >
                {item.name}
              </span>
              :{' '}
              {item.value
                ? formatValueForPresentation(activeLocale, item.value, true, 1)
                : ''}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export const renderTooltip = ({
  slice,
  tickFormatter,
  componentsWithAddedProps,
}: ExtraTooltipProps) => {
  return (
    <Tooltip
      wrapperStyle={{
        maxWidth: '60%',
      }}
      cursor={{
        fill: '#ccc',
        fillOpacity: 0.15,
      }}
      content={(props) =>
        CustomTooltipRenderer({
          ...(props as TooltipProps<string, number>),
          slice,
          componentsWithAddedProps,
          tickFormatter,
        })
      }
    />
  )
}
