import { Tooltip } from 'recharts'
import { formatValueForPresentation } from '../utils'

export const CustomTooltipRenderer = (props) => {
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
      {payload.map((item) => (
        <li>
          <span
            style={{
              color: item?.stroke ?? item?.payload?.stroke ?? 'black',
            }}
          >
            {item.name}
          </span>
          : {formatValueForPresentation(item.value)}
        </li>
      ))}
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
