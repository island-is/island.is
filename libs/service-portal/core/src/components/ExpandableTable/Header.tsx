import React, { FC } from 'react'

import { Text } from '@island.is/island-ui/core'
import { Table as T } from '@island.is/island-ui/core'
import { tableStyles } from '../../utils/utils'
interface Props {
  data: Array<{
    value: string | React.ReactElement
    align?: 'left' | 'right'
    element?: boolean
    printHidden?: boolean
    width?: string
  }>
}

const ExpandableLine: FC<React.PropsWithChildren<Props>> = ({ data }) => {
  return (
    <T.Head>
      <T.Row>
        {data.map((item, i) => (
          <T.HeadData
            box={{
              textAlign: item.align ?? 'left',
              printHidden: item.printHidden,
            }}
            scope="col"
            key={i}
            style={tableStyles}
            width={item.width}
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
