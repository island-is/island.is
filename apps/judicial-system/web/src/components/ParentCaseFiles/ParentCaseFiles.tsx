import React from 'react'
import { useIntl } from 'react-intl'

import {
  Accordion,
  AccordionItem,
  Box,
  UploadedFile,
} from '@island.is/island-ui/core'
import { CaseFile } from '@island.is/judicial-system/types'

import { parentCaseFiles as m } from './ParentCaseFiles.strings'

interface Props {
  files?: CaseFile[]
}

const ParentCaseFiles: React.FC<React.PropsWithChildren<Props>> = ({
  files,
}) => {
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
          label={`${formatMessage(m.heading)} (${files.length})`}
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
