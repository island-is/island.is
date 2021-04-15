import * as s from './RegulationDisplay.treat'

import { AlertMessage, Box } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { HTMLDump } from './HTMLDump'
import { RegulationMaybeDiff } from './Regulations.types'

export type CommentsBoxProps = {
  title: string
  content: RegulationMaybeDiff['comments']
}

export const CommentsBox: FC<CommentsBoxProps> = (props) =>
  props.content && (
    <Box marginTop={[6, 10]} id="aths_ritstjora">
      <AlertMessage
        type="info"
        title={props.title}
        message={<HTMLDump className={s.bodyText} html={props.content} />}
      />
    </Box>
  )
