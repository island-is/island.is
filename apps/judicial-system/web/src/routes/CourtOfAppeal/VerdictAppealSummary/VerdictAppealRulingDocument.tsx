import type { FC } from 'react'
import { AnimatePresence } from 'motion/react'

import { Box } from '@island.is/island-ui/core'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  RenderFiles,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import FileNotFoundModal from '@island.is/judicial-system-web/src/components/Modals/FileNotFoundModal/FileNotFoundModal'
import useFileList from '@island.is/judicial-system-web/src/utils/hooks/useFileList'

import { getAppealRulingTypeWording } from '../VerdictAppealStatus/RegisterConclusion.logic'
import { getVerdictAppealRulingFiles } from './VerdictAppealSummary.logic'

interface Props {
  workingCase: WorkingCase
}

/**
 * The document the Court of Appeals ended the appeal with, titled for whether
 * it is a verdict or a ruling. Only opened here: it is replaced on the step
 * where it was uploaded. Renders nothing until there is one.
 */
const VerdictAppealRulingDocument: FC<Props> = ({ workingCase }) => {
  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
  })

  const rulingFiles = getVerdictAppealRulingFiles(workingCase)

  if (rulingFiles.length === 0) {
    return null
  }

  return (
    <Box component="section">
      <SectionHeading
        title={
          getAppealRulingTypeWording(
            workingCase.verdictAppealCase?.appealRulingType,
          ).document
        }
        marginBottom={1}
      />
      <RenderFiles caseFiles={rulingFiles} onOpenFile={onOpen} />
      <AnimatePresence>
        {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
      </AnimatePresence>
    </Box>
  )
}

export default VerdictAppealRulingDocument
