import React, { FC } from 'react'

import { Text } from '@island.is/island-ui/core'
import { Table as T } from '@island.is/island-ui/core'

interface Props {
  data: Array<string>
}

const ExpandableLine: FC<Props> = ({ data }) => {
  return (
    <>
      <T.Head>
        <T.Row>
          {data.map((item, i) => (
            <T.HeadData box={{ paddingLeft: 2, paddingRight: 2 }} key={i}>
              <Text variant="eyebrow" fontWeight="semiBold">
                {item}
              </Text>
            </T.HeadData>
          ))}
          <T.HeadData style={{ width: 75 }}></T.HeadData>
        </T.Row>
      </T.Head>
    </>
  )
}

export default ExpandableLine
