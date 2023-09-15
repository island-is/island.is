import React from 'react'
import { useIntl } from 'react-intl'

import { AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { commentsAccordion } from '@island.is/judicial-system-web/messages'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import MarkdownWrapper from '../../MarkdownWrapper/MarkdownWrapper'

interface Props {
  workingCase: Case
}

const CommentsAccordionItem: React.FC<React.PropsWithChildren<Props>> = (
  props,
) => {
  const { workingCase } = props
  const { formatMessage } = useIntl()

  return (
    <AccordionItem id="id_5" label="Athugasemdir" labelVariant="h3">
      {workingCase.comments && (
        <Box marginBottom={workingCase.caseFilesComments ? 3 : 0}>
          <Box marginBottom={1}>
            <Text variant="h4" as="h4">
              {formatMessage(commentsAccordion.comments)}
            </Text>
          </Box>
          <Text whiteSpace="breakSpaces">{workingCase.comments}</Text>
        </Box>
      )}
      {workingCase.caseFilesComments && (
        <>
          <Box marginBottom={1}>
            <Text variant="h4" as="h4">
              {formatMessage(commentsAccordion.caseFilesComments)}
            </Text>
          </Box>
          <Text whiteSpace="breakSpaces">{workingCase.caseFilesComments}</Text>
        </>
      )}
      {workingCase.caseResentExplanation && (
        <>
          <Box marginBottom={1}>
            <Text variant="h4" as="h4">
              {formatMessage(commentsAccordion.caseResentExplanation)}
            </Text>
          </Box>
          <Text whiteSpace="breakSpaces">
            <MarkdownWrapper markdown={workingCase.caseResentExplanation} />
          </Text>
        </>
      )}
    </AccordionItem>
  )
}

export default CommentsAccordionItem
