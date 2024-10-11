import React from 'react'

import { AlertMessage, Box } from '@island.is/island-ui/core'
import { RegulationMaybeDiff } from '@island.is/regulations'

import { HTMLBox } from './HTMLBox'
import * as s from './RegulationDisplay.css'

export type CommentsBoxProps = {
  title: string
  content: RegulationMaybeDiff['comments']
}

export const CommentsBox = (props: CommentsBoxProps) =>
  props.content ? (
    <Box marginTop={[6, 10]} id="aths_ritstjora">
      <AlertMessage
        type="info"
        title={props.title}
        message={
          <HTMLBox className={s.bodyText} html={props.content} marginTop={1} />
        }
      />
    </Box>
  ) : null
