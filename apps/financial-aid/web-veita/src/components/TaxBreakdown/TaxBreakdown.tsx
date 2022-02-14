import React from 'react'
import { Text } from '@island.is/island-ui/core'
import TaxBreakdownItem from './TaxBreakdownItem'

import * as styles from './TaxBreakdown.css'

const TaxBreakdown = () => {
  return (
    <table className={styles.tableContainer}>
      <tr>
        <th>
          <Text variant="small" fontWeight="semiBold">
            Fyrirtæki
          </Text>
        </th>
        <th>
          <Text variant="small" fontWeight="semiBold">
            Heildarlaun
          </Text>
        </th>
        <th>
          <Text variant="small" fontWeight="semiBold">
            Persónuafsláttur
          </Text>
        </th>
        <th>
          <Text variant="small" fontWeight="semiBold">
            Staðgreiðsla
          </Text>
        </th>
      </tr>
      <TaxBreakdownItem headline="Janúar 2022">
        <td>kr</td>
        <td>kr</td>
        <td>kr</td>
        <td>kr</td>
      </TaxBreakdownItem>
      <TaxBreakdownItem headline="Samantekt">
        <td>
          <Text variant="small">Samtals:</Text>
        </td>
        <td>
          <Text variant="small">kr</Text>
        </td>
        <td>
          <Text variant="small">kr</Text>
        </td>
        <td>
          <Text variant="small">kr</Text>
        </td>
      </TaxBreakdownItem>
      <tr>
        <td>
          <Text variant="small">Meðaltal:</Text>
        </td>
        <td colSpan={3}>
          <Text variant="small">kr.</Text>
        </td>
      </tr>
    </table>
  )
}

export default TaxBreakdown
