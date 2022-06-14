import React from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  AccordionItem,
  UploadedFile,
  Accordion,
} from '@island.is/island-ui/core'
import { rcCaseFiles } from '@island.is/judicial-system-web/messages'
import { icCaseFiles } from '@island.is/judicial-system-web/messages'
import { CaseFile } from '@island.is/judicial-system/types'

interface Props {
  files?: CaseFile[]
  caseType: CaseType
}

const ParentCaseFiles: React.FC<Props> = ({ files, caseType }) => {
  const { formatMessage } = useIntl()

  if (!files || files.length < 1) {
    return null
  }

  return (
    <Box marginBottom={5}>
      <Accordion dividerOnTop={false}>
        <AccordionItem
          id="parentCaseFiles"
          labelVariant="h3"
          label={`${formatMessage(
            isRestrictionCase(caseType)
              ? rcCaseFiles.sections.parentCaseFiles.heading
              : icCaseFiles.sections.policeCaseFiles.heading,
          )} (${files.length})`}
        >
          {files.map((file, index) => (
            <Box key={`${file.id}-${index}`} marginTop={3}>
              <UploadedFile
                file={{ ...file, name: `${index + 1}. ${file.name}` }}
                showFileSize
                hideIcons
                defaultBackgroundColor={{
                  background: 'blue100',
                  border: 'blue100',
                }}
              />
            </Box>
          ))}
        </AccordionItem>
      </Accordion>
    </Box>
  )
}

export default ParentCaseFiles
