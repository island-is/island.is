import { TooltipProps } from 'recharts'
import * as styles from '../charts.css'
import cn from 'classnames'

export const CustomTooltip = ({
  payload,
  active,
  label,
}: TooltipProps<string, number>) => {
  if (active && payload && payload.length) {
    return (
      <div className={cn(styles.tooltip)}>
        <p>{label}</p>
        {payload.map((item, index) => (
          <li className={cn(styles.list)} key={`item-${index}`}>
            <div
              className={cn(styles.dot)}
              style={{
                border: '3px solid ' + item.color,
              }}
            />
            {item.name} : {item.value}
          </li>
        ))}
      </div>
    )
  }

  return null
}
