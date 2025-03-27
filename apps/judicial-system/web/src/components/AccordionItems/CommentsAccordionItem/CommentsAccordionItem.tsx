import { FC } from 'react'
import { useIntl } from 'react-intl'

import { AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'

import MarkdownWrapper from '../../MarkdownWrapper/MarkdownWrapper'
import { strings } from './CommentsAccordionItem.strings'

interface Props {
  workingCase: Case
}

const CommentsAccordionItem: FC<Props> = (props) => {
  const { workingCase } = props
  const { formatMessage } = useIntl()

  const commentCount =
    (workingCase.comments ? 1 : 0) +
    (workingCase.caseFilesComments ? 1 : 0) +
    (workingCase.caseResentExplanation ? 1 : 0)

  return (
    <AccordionItem
      id="id_5"
      label={formatMessage(strings.label, {
        commentCount,
      })}
      labelVariant="h3"
    >
      {workingCase.comments && (
        <Box marginBottom={workingCase.caseFilesComments ? 3 : 0}>
          <Box marginBottom={1}>
            <Text variant="h4" as="h4">
              {formatMessage(strings.comments)}
            </Text>
          </Box>
          <Text whiteSpace="breakSpaces">{workingCase.comments}</Text>
        </Box>
      )}
      {workingCase.caseFilesComments && (
        <Box marginBottom={workingCase.caseResentExplanation ? 3 : 0}>
          <Box marginBottom={1}>
            <Text variant="h4" as="h4">
              {formatMessage(strings.caseFilesComments)}
            </Text>
          </Box>
          <Text whiteSpace="breakSpaces">{workingCase.caseFilesComments}</Text>
        </Box>
      )}
      {workingCase.caseResentExplanation && (
        <>
          <Box marginBottom={1}>
            <Text variant="h4" as="h4">
              {formatMessage(strings.caseResentExplanation)}
            </Text>
          </Box>
          <MarkdownWrapper markdown={workingCase.caseResentExplanation} />
        </>
      )}
    </AccordionItem>
  )
}

export default CommentsAccordionItem
