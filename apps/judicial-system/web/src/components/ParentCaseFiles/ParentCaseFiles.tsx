import { FC } from 'react'
import { useIntl } from 'react-intl'

import {
  Accordion,
  AccordionItem,
  Box,
  UploadedFile,
} from '@island.is/island-ui/core'
import { CaseFile } from '@island.is/judicial-system-web/src/graphql/schema'

import { parentCaseFiles as m } from './ParentCaseFiles.strings'

interface Props {
  files?: CaseFile[] | null
}

const ParentCaseFiles: FC<Props> = ({ files }) => {
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
                file={{
                  ...file,
                  name: `${index + 1}. ${file.name}`,
                  type: file.type ?? undefined,
                  key: file.key ?? undefined,
                  size: file.size ?? undefined,
                }}
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
