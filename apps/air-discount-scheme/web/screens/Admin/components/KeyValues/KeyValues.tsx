import React from 'react'

import { Typography, Box } from '@island.is/island-ui/core'
import { KeyValue } from '@island.is/air-discount-scheme-web/components'

import { TItem } from '../../types'

interface PropTypes {
  data: TItem
  title: string
}

function KeyValues({ data, title }: PropTypes) {
  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="eyebrow" color="blue400">
        {title}
      </Typography>
      <Box
        marginTop={1}
        display="flex"
        flexWrap="wrap"
        justifyContent="spaceBetween"
      >
        <KeyValue label="Flugleggir" value={data.count} />
        <KeyValue
          color="red400"
          label="Afsláttur (kr.)"
          value={`${(data.originalPrice - data.discountPrice).toLocaleString(
            'de-DE',
          )}.-`}
        />
        <KeyValue
          label="Afsláttarverð (kr.)"
          value={`${data.discountPrice.toLocaleString('de-DE')}.-`}
        />
        <KeyValue
          label="Upphafsverð (kr.)"
          value={`${data.originalPrice.toLocaleString('de-DE')}.-`}
        />
      </Box>
    </Box>
  )
}

export default KeyValues
