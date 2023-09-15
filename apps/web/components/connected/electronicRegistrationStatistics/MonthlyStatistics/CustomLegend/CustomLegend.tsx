import { LegendProps } from 'recharts'
import cn from 'classnames'

import * as styles from './CustomLegend.css'

interface CustomLegendProps extends LegendProps {
  title?: string
}

export const CustomLegend = (props: CustomLegendProps) => {
  const { payload, title } = props

  const items = payload ?? []

  return (
    <div className={cn(styles.wrapper)}>
      <p className={cn(styles.title)}>{title}</p>
      <ul className={cn(styles.listWrapper)}>
        {items.map((entry, index) => (
          <li className={cn(styles.list)} key={`item-${index}`}>
            <div
              className={cn(styles.dot)}
              style={{
                border: '3px solid ' + entry.color,
              }}
            />
            {entry.value}
          </li>
        ))}
      </ul>
    </div>
  )
}
