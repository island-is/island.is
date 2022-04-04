import React, { FC } from 'react'

import { Text } from '@island.is/island-ui/core'
import { Table as T } from '@island.is/island-ui/core'
import { tableStyles } from '@island.is/service-portal/core'
interface Props {
  data: Array<{
    value: string | React.ReactElement
    align?: 'left' | 'right'
    element?: boolean
  }>
}

const ExpandableLine: FC<Props> = ({ data }) => {
  return (
    <T.Head>
      <T.Row>
        {data.map((item, i) => (
          <T.HeadData
            box={item.align ? { textAlign: item.align } : undefined}
            scope="col"
            key={i}
            style={tableStyles}
          >
            <Text
              variant="medium"
              fontWeight="semiBold"
              as={item.element ? 'span' : 'p'}
            >
              {item.value}
            </Text>
          </T.HeadData>
        ))}
      </T.Row>
    </T.Head>
  )
}

export default ExpandableLine
