import React from 'react'

import { Text, Box, Columns, Column } from '@island.is/island-ui/core'
import KeyValue from './KeyValue'

import { TItem } from '../../types'

interface PropTypes {
  data: TItem
  title: string
}

function KeyValues({ data, title }: PropTypes) {
  return (
    <Box display="flex" flexDirection="column">
      <Text variant="eyebrow" color="blue400">
        {title}
      </Text>
      <Columns space={2} collapseBelow="sm">
        <Column>
          <KeyValue label="Flugleggir" value={data.count} />
        </Column>
        <Column>
          <KeyValue
            color="red400"
            label="Afsláttur (kr.)"
            value={`${(data.originalPrice - data.discountPrice).toLocaleString(
              'de-DE',
            )}.-`}
          />
        </Column>
        <Column>
          <KeyValue
            label="Afsláttarverð (kr.)"
            value={`${data.discountPrice.toLocaleString('de-DE')}.-`}
          />
        </Column>
        <Column>
          <KeyValue
            label="Upphafsverð (kr.)"
            value={`${data.originalPrice.toLocaleString('de-DE')}.-`}
          />
        </Column>
      </Columns>
    </Box>
  )
}

export default KeyValues
