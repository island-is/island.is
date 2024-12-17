import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import { ConclusionView } from '../../shared'
import { ConclusionDefault } from './Default'
import { ConclusionOverview } from './Overview'

export const Conclusion: FC<FieldBaseProps> = (props) => {
  const [view, setView] = useState<ConclusionView>(ConclusionView.DEFAULT)

  return (
    <Box>
      {view === ConclusionView.DEFAULT && (
        <ConclusionDefault {...props} setView={setView} />
      )}
      {view === ConclusionView.OVERVIEW && (
        <ConclusionOverview {...props} setView={setView} />
      )}
    </Box>
  )
}
