import type { FC } from 'react'

import { Text } from '@island.is/island-ui/core'
import * as styles from '@island.is/judicial-system-web/src/components/Table/Table.css'

interface Props {
  title: string
}

const TableHeaderText: FC<Props> = (props) => {
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
