import React from 'react'
import * as styles from './TaxBreakdown.css'

interface Props {
  headline: string
}

const TaxBreakdownHeadline = ({ headline }: Props) => {
  return (
    <tr className={styles.headlineContainer}>
      <td colSpan={4}>{headline}</td>
    </tr>
  )
}

export default TaxBreakdownHeadline
