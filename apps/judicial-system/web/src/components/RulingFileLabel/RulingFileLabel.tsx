import { FC } from 'react'

import { Text } from '@island.is/island-ui/core'

import { CaseFile } from '../../graphql/schema'

interface Props {
  caseFiles?: CaseFile[] | null
  rulingFileId?: string | null
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p'
}

const RulingFileLabel: FC<Props> = ({ caseFiles, rulingFileId, as }) => {
  if (!rulingFileId) {
    return null
  }

  const rulingFile = caseFiles?.find((f) => f.id === rulingFileId)
  const rulingFileName = rulingFile?.userGeneratedFilename ?? rulingFile?.name

  if (!rulingFileName) {
    return null
  }

  return (
    <Text as={as ?? 'h5'} variant="h5">
      {rulingFileName}
    </Text>
  )
}

export default RulingFileLabel
