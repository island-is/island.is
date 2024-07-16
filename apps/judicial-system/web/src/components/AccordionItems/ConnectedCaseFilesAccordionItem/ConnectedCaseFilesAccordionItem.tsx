import React, { FC } from 'react'
import { useIntl } from 'react-intl'

import { AccordionItem } from '@island.is/island-ui/core'

import { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import { strings } from './ConnectedCaseFilesAccordionItem.strings'

import { IndictmentCaseFilesList } from '@island.is/judicial-system-web/src/components'

interface Props {
  connectedCase: Case
}

const ConnectedCaseFilesAccordionItem: FC<Props> = ({ connectedCase }) => {
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
      />
    </AccordionItem>
  )
}

export default ConnectedCaseFilesAccordionItem
