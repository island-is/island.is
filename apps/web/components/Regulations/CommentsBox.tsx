import * as s from './RegulationDisplay.treat'

import { AlertMessage, Box } from '@island.is/island-ui/core'
import React from 'react'
import { HTMLBox } from '@island.is/regulations/react'
import { RegulationMaybeDiff } from '@island.is/regulations/web'

export type CommentsBoxProps = {
  title: string
  content: RegulationMaybeDiff['comments']
}

export const CommentsBox = (props: CommentsBoxProps) =>
  props.content && (
    <Box marginTop={[6, 10]} id="aths_ritstjora">
      <AlertMessage
        type="info"
        title={props.title}
        message={
          <HTMLBox className={s.bodyText} html={props.content} marginTop={1} />
        }
      />
    </Box>
  )
