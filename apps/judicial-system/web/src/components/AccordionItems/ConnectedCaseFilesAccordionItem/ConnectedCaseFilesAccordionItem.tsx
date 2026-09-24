import type { FC } from 'react'

import { AccordionItem } from '@island.is/island-ui/core'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { IndictmentCaseFilesList } from '@island.is/judicial-system-web/src/components'

interface Props {
  connectedCaseParentId: string
  connectedCase: WorkingCase
  displayGeneratedPDFs?: boolean
}

const ConnectedCaseFilesAccordionItem: FC<Props> = ({
  connectedCaseParentId,
  connectedCase,
  displayGeneratedPDFs = true,
}) => {
  const { courtCaseNumber, courtSessions, caseFiles } = connectedCase

  const hasCaseFiles =
    courtSessions?.some(
      (courtSession) =>
        courtSession.filedDocuments && courtSession.filedDocuments.length > 0,
    ) ||
    (caseFiles && caseFiles.length > 0)

  if (!courtCaseNumber || !hasCaseFiles) {
    return null
  }

  return (
    <AccordionItem
      id="connectedCaseFiles"
      labelVariant="h3"
      label={`Gögn úr máli ${connectedCase.courtCaseNumber}`}
    >
      <IndictmentCaseFilesList
        workingCase={connectedCase}
        displayHeading={false}
        displayGeneratedPDFs={displayGeneratedPDFs}
        connectedCaseParentId={connectedCaseParentId}
      />
    </AccordionItem>
  )
}

export default ConnectedCaseFilesAccordionItem
