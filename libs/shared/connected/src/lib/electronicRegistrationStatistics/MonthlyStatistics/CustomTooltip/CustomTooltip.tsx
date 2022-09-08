import { TooltipProps } from 'recharts'
import * as styles from './CustomTooltip.css'

export const CustomTooltip = ({
  payload,
  active,
  label,
}: TooltipProps<string, number>) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.container}>
        <p>{label}</p>
        {payload.map((item, index) => (
          <li key={`item-${index}`} className={styles.listItemOuterContainer}>
            <div
              style={{ border: '3px solid ' + item.color }}
              className={styles.listItemInnerContainer}
            />
            {item.name}: {item.value}
          </li>
        ))}
      </div>
    )
  }

  return null
}
