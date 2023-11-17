import { Tooltip, TooltipProps } from 'recharts'

import { theme } from '@island.is/island-ui/theme'

import { formatValueForPresentation } from '../utils'

export const CustomTooltipRenderer = (props: TooltipProps<string, number>) => {
  const { active, payload } = props
  const isActive = active && payload && payload.length

  if (!isActive) {
    return null
  }

  return (
    <ul
      style={{
        backgroundColor: 'white',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '4px',
      }}
    >
      {payload.map((item) => {
        let labelColor =
          (item as any)?.stroke ?? item?.payload?.stroke ?? theme.color.dark400

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
            : {formatValueForPresentation(item.value)}
          </li>
        )
      })}
    </ul>
  )
}

export const renderTooltip = (props: any) => {
  return (
    <Tooltip
      cursor={{
        fill: '#ccc',
        fillOpacity: 0.15,
      }}
      content={CustomTooltipRenderer}
    />
  )
}
