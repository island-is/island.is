import React, { FC } from 'react'

import { Text, Table as T } from '@island.is/island-ui/core'

interface Props {
  labels: Array<{ value: string }>
}

export const HistoryTableHeader: FC<React.PropsWithChildren<Props>> = ({
  labels,
}) => {
  return (
    <T.Head>
      <T.Row>
        {labels.map((label, index) => (
          <T.HeadData key={index}>
            <Text variant="medium" fontWeight="semiBold">
              {label.value}
            </Text>
          </T.HeadData>
        ))}
      </T.Row>
    </T.Head>
  )
}

export default HistoryTableHeader
