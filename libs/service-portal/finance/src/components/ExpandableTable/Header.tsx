import React, { FC } from 'react'

import { Text } from '@island.is/island-ui/core'
import { Table as T } from '@island.is/island-ui/core'

interface Props {
  data: Array<{ value: string; align?: 'left' | 'right' }>
}

const ExpandableLine: FC<Props> = ({ data }) => {
  return (
    <>
      <T.Head>
        <T.Row>
          {data.map((item, i) => (
            <T.HeadData
              box={item.align ? { textAlign: item.align } : undefined}
              scope="col"
              key={i}
            >
              <Text variant="eyebrow" fontWeight="semiBold">
                {item.value}
              </Text>
            </T.HeadData>
          ))}
          <T.HeadData box={{ printHidden: true }}></T.HeadData>
        </T.Row>
      </T.Head>
    </>
  )
}

export default ExpandableLine
