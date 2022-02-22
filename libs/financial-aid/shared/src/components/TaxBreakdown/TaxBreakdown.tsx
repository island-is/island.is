import React from 'react'
import { Text } from '@island.is/island-ui/core'
import TaxBreakdownItem from './TaxBreakdownItem'

import * as styles from './TaxBreakdown.css'
import {
  DirectTaxPayment,
  formatNationalId,
  getMonth,
} from '@island.is/financial-aid/shared/lib'

export const taxBreakDownHeaders = [
  'Fyrirtæki',
  'Heildarlaun',
  'Persónuafsláttur',
  'Staðgreiðsla',
]

interface Props {
  items: DirectTaxPayment[]
}

const TaxBreakdown = ({ items }: Props) => {
  return (
    <table className={styles.tableContainer}>
      <thead>
        <tr className={styles.tableHeaders}>
          {taxBreakDownHeaders.map((headers) => {
            return (
              <th>
                <Text variant="small" fontWeight="semiBold">
                  {headers}
                </Text>
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {items.map((i) => {
          return (
            <TaxBreakdownItem
              headline={`${getMonth(i.month)} ${i.year}`}
              items={[
                formatNationalId(i.payerNationalId),
                `${i.totalSalary.toLocaleString('de-DE')} kr.`,
                `${i.personalAllowance.toLocaleString('de-DE')} kr.`,
                `${i.withheldAtSource.toLocaleString('de-DE')} kr.`,
              ]}
            />
          )
        })}
      </tbody>
    </table>
  )
}

export default TaxBreakdown
