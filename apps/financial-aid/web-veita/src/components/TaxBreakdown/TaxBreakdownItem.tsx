import React, { ReactNode } from 'react'
import * as styles from './TaxBreakdown.css'

interface Props {
  headline: string
  children: ReactNode
}

const TaxBreakdownItem = ({ headline, children }: Props) => {
  return (
    <>
      <tr className={styles.headlineContainer}>
        <td colSpan={4}>{headline}</td>
      </tr>
      <tr>{children}</tr>
    </>
  )
}

export default TaxBreakdownItem
