import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, Text } from '@island.is/island-ui/core'

import EditableCaseFile from '../EditableCaseFile/EditableCaseFile'
import { strings } from './UploadFiles.strings'
import * as styles from './UploadFiles.css'

interface Props {
  files: { name: string }[]
}

const UploadFiles: FC<Props> = (props) => {
  const { files } = props
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
      <Box marginBottom={2}>
        <Button variant="ghost" size="small" icon="attach">
          {formatMessage(strings.buttonText)}
        </Button>
      </Box>
      {files.map((file, index) => (
        <Box key={index} marginBottom={1}>
          <EditableCaseFile
            enableDrag={false}
            caseFile={{
              id: '',
              created: undefined,
              displayDate: undefined,
              displayText: file.name,
              canOpen: undefined,
              userGeneratedFilename: undefined,
            }}
            onReorder={function (id?: string): void {
              throw new Error('Function not implemented.')
            }}
            onOpen={function (id: string): void {
              throw new Error('Function not implemented.')
            }}
            onRename={function (
              id: string,
              name?: string,
              displayDate?: string,
            ): void {
              throw new Error('Function not implemented.')
            }}
            onDelete={function (id: string): void {
              throw new Error('Function not implemented.')
            }}
          />
        </Box>
      ))}
    </div>
  )
}

export default UploadFiles
