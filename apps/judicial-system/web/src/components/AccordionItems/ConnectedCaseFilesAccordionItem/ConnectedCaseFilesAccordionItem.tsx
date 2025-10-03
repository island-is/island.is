import { FC } from 'react'
import { useIntl } from 'react-intl'

import { AccordionItem } from '@island.is/island-ui/core'
import { IndictmentCaseFilesList } from '@island.is/judicial-system-web/src/components'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './ConnectedCaseFilesAccordionItem.strings'

interface Props {
  connectedCaseParentId: string
  connectedCase: Case
  displayGeneratedPDFs?: boolean
}

const ConnectedCaseFilesAccordionItem: FC<Props> = ({
  connectedCaseParentId,
  connectedCase,
  displayGeneratedPDFs = true,
}) => {
  const { formatMessage } = useIntl()
  const { caseFiles, courtCaseNumber } = connectedCase

  if (!courtCaseNumber || !caseFiles || caseFiles.length < 1) {
    return null
  }

  return (
    <AccordionItem
      id="connectedCaseFiles"
      labelVariant="h3"
      label={formatMessage(strings.heading, {
        caseNumber: connectedCase.courtCaseNumber,
      })}
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
