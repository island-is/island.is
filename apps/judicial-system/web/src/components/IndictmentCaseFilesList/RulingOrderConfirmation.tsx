import { FC } from 'react'

import { Box } from '@island.is/island-ui/core'
import { PdfButton } from '@island.is/judicial-system-web/src/components'
import { CaseFile } from '@island.is/judicial-system-web/src/graphql/schema'

import RulingOrderConfirmationStatus from './RulingOrderConfirmationStatus'

interface Props {
  file: CaseFile
  onOpenFile: (fileId: string) => void
}

/**
 * Ruling-order file row used when the appeal context menu feature is off.
 * Shows the file link with its confirmation state on the right.
 */
const RulingOrderConfirmation: FC<Props> = ({ file, onOpenFile }) => {
  const fileName = file.userGeneratedFilename ?? file.name ?? ''

  return (
    <Box display="flex" alignItems="center">
      <Box flexGrow={1}>
        <PdfButton
          title={fileName}
          renderAs="row"
          disabled={!file.isKeyAccessible}
          handleClick={() => onOpenFile(file.id)}
        >
          <RulingOrderConfirmationStatus file={file} />
        </PdfButton>
      </Box>
    </Box>
  )
}

export default RulingOrderConfirmation
