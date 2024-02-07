import { Tooltip, TooltipProps } from 'recharts'

import { theme } from '@island.is/island-ui/theme'
import { Chart } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'

import { formatValueForPresentation } from '../../utils'
import * as style from './TooltipRenderer.css'

interface ExtraTooltipProps {
  slice: Chart
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
        {payload.map((item) => {
          let labelColor =
            (item as any)?.stroke ??
            item?.payload?.stroke ??
            theme.color.dark400

          if (labelColor === 'white' || labelColor === '#fff') {
            labelColor = theme.color.dark400
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

export const renderTooltip = ({ slice, tickFormatter }: ExtraTooltipProps) => {
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
          tickFormatter,
        })
      }
    />
  )
}
