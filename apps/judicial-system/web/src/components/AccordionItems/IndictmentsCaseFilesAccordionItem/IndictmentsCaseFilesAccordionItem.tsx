import React from 'react'
import { useIntl } from 'react-intl'

import { AccordionItem, Text, Box } from '@island.is/island-ui/core'
import { CaseFile } from '@island.is/judicial-system/types'

import { indictmentsCaseFilesAccordionItem as m } from './IndictmentsCaseFilesAccordionItem.strings'

interface Props {
  policeCaseNumber: string
  caseFiles: CaseFile[]
}

const IndictmentsCaseFilesAccordionItem: React.FC<Props> = (props) => {
  const { policeCaseNumber, caseFiles } = props
  const { formatMessage } = useIntl()
  return (
    <AccordionItem
      id="IndictmentsCaseFilesAccordionItem"
      label={formatMessage(m.title, {
        policeCaseNumber,
      })}
      labelVariant="h3"
    >
      {caseFiles.length === 0 ? (
        <Text>{formatMessage(m.noCaseFiles)}</Text>
      ) : (
        <>
          <Box marginBottom={3}>
            <Text>{formatMessage(m.explanation)}</Text>
          </Box>
          {caseFiles.map((caseFile) => (
            <div key={caseFile.id}></div>
          ))}
        </>
      )}
    </AccordionItem>
  )
}

export default IndictmentsCaseFilesAccordionItem
