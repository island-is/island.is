import React from 'react'

import { AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system/types'

interface Props {
  workingCase: Case
}

const CommentsAccordionItem: React.FC<Props> = (props) => {
  const { workingCase } = props

  return (
    <AccordionItem id="id_5" label="Athugasemdir" labelVariant="h3">
      {Boolean(workingCase.comments) && (
        <Box marginBottom={workingCase.caseFilesComments ? 3 : 0}>
          <Box marginBottom={1}>
            <Text variant="h4" as="h4">
              Athugasemdir vegna málsmeðferðar
            </Text>
          </Box>
          <Text whiteSpace="breakSpaces">{workingCase.comments}</Text>
        </Box>
      )}
      {Boolean(workingCase.caseFilesComments) && (
        <>
          <Box marginBottom={1}>
            <Text variant="h4" as="h4">
              Athugasemdir vegna rannsóknargagna
            </Text>
          </Box>
          <Text whiteSpace="breakSpaces">{workingCase.caseFilesComments}</Text>
        </>
      )}
    </AccordionItem>
  )
}

export default CommentsAccordionItem
