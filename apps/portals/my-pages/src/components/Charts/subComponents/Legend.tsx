import { LegendProps } from 'recharts'
import * as styles from '../charts.css'
import cn from 'classnames'

interface CustomLegendProps extends LegendProps {
  title?: string
}
export const RenderLegend = (props: CustomLegendProps) => {
  const { payload, title } = props

  return (
    <div className={cn(styles.wrapper)}>
      <p className={cn(styles.title)}>{title}</p>
      <ul className={cn(styles.listWrapper)}>
        {payload
          ? payload.map((entry, index) => (
              <li className={cn(styles.list)} key={`item-${index}`}>
                <div
                  className={cn(styles.dot)}
                  style={{
                    border: '3px solid ' + entry.color,
                  }}
                />
                {entry.value}
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}
