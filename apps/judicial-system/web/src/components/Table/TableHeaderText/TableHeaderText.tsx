import React from 'react'

import { Text } from '@island.is/island-ui/core'

import * as styles from '../Table.css'

interface Props {
  title: string
}

const TableHeaderText: React.FC<Props> = (props) => {
  const { title } = props

  return (
    <th className={styles.th}>
      <Text as="span" fontWeight="regular">
        {title}
      </Text>
    </th>
  )
}

export default TableHeaderText
