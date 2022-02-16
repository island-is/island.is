import React, { ReactNode } from 'react'
import * as styles from './TaxBreakdown.css'

interface Props {
  headline: string
  items: Array<string | number>
}

const TaxBreakdownItem = ({ headline, items }: Props) => {
  return (
    <>
      <tr className={styles.headlineContainer}>
        <td colSpan={4}>{headline}</td>
      </tr>
      <tr>
        {items.map((el) => {
          return <td>{el}</td>
        })}
      </tr>
    </>
  )
}

export default TaxBreakdownItem
