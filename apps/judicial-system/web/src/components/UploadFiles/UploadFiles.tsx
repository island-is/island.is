import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, Text } from '@island.is/island-ui/core'

import { ReorderableItem } from '../AccordionItems/IndictmentsCaseFilesAccordionItem/IndictmentsCaseFilesAccordionItem'
import EditableCaseFile from '../EditableCaseFile/EditableCaseFile'
import { strings } from './UploadFiles.strings'
import * as styles from './UploadFiles.css'

interface Props {
  files: ReorderableItem[]
  onOpen: (id: string) => void
  onRename: (id: string, name?: string, displayDate?: string) => void
  onDelete: (id: string) => void
}

const UploadFiles: FC<Props> = (props) => {
  const { files, onOpen, onRename, onDelete } = props
  const { formatMessage } = useIntl()

  return (
    <div className={styles.container}>
      <Box marginBottom={1}>
        <Text variant="h4" as="h4">
          {formatMessage(strings.heading)}
        </Text>
      </Box>
      <Box marginBottom={2}>
        <Text>{formatMessage(strings.acceptFiles)}</Text>
      </Box>
      <Box marginBottom={3}>
        <Button variant="ghost" size="small" icon="attach">
          {formatMessage(strings.buttonText)}
        </Button>
      </Box>
      {files.map((file) => (
        <Box key={file.id} marginBottom={1} width="full">
          <EditableCaseFile
            enableDrag={false}
            caseFile={file}
            onOpen={onOpen}
            onRename={onRename}
            onDelete={onDelete}
          />
        </Box>
      ))}
    </div>
  )
}

export default UploadFiles
