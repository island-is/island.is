import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import { Box, IconMapIcon, StatusColor, Text } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'
import { caseFiles as m } from '@island.is/judicial-system-web/messages'
import {
  CaseFile,
  FileNotFoundModal,
  FormContext,
} from '@island.is/judicial-system-web/src/components'
import type {
  CaseFileStatus,
  CaseFileWithStatus,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  caseId: string
  files: CaseFileWithStatus[]
  hideIcons?: boolean
  canOpenFiles?: boolean
  handleRetryClick?: (id: string) => void
}

const getBackgroundColor = (caseFile: CaseFileWithStatus): StatusColor => {
  if (
    caseFile.status === 'broken' ||
    caseFile.status === 'done-broken' ||
    !caseFile.id ||
    !caseFile.key
  ) {
    return { background: 'dark100', border: 'dark200' }
  } else if (caseFile.status === 'error') {
    return { background: 'red100', border: 'red200' }
  } else {
    return { background: 'blue100', border: 'blue300' }
  }
}

const CaseFileList: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {
    caseId,
    files,
    hideIcons = true,
    canOpenFiles = true,
    handleRetryClick,
  } = props

  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId,
  })
  const { formatMessage } = useIntl()

  const getIcon = (
    file: CaseFileWithStatus,
  ): {
    icon: IconMapIcon
    color: Colors
    onClick?: (fileId: string) => void
  } | null => {
    switch (file.status) {
      case 'error':
        return {
          icon: 'reload',
          color: 'blue400',
          onClick: handleRetryClick
            ? () => handleRetryClick(file.id)
            : undefined,
        }
      case 'done':
      case 'done-broken':
        return {
          icon: 'checkmark',
          color: 'blue400',
        }
      default:
        return null
    }
  }

  if (files.length === 0) {
    return <Text>{formatMessage(m.noFilesFound)}</Text>
  }

  return (
    <>
      {files.map((file, index) => {
        if (!file.name) return null
        const iconProperties = getIcon(file)

        return (
          <Box
            marginBottom={
              index === files.length - 1 ||
              file.status === 'case-not-found' ||
              file.status === 'unsupported'
                ? 0
                : 3
            }
            key={file.id}
          >
            <CaseFile
              name={file.name}
              size={file.size}
              color={getBackgroundColor(file)}
              icon={
                hideIcons === false && iconProperties !== null
                  ? iconProperties
                  : undefined
              }
              id={file.id}
              onClick={
                canOpenFiles && file.key && file.id
                  ? () => onOpen(file.id)
                  : undefined
              }
            />
            {file.status === 'unsupported' && (
              <Text color="red600" variant="eyebrow" lineHeight="lg">
                {formatMessage(m.fileUnsupportedInCourt)}
              </Text>
            )}
            {file.status === 'case-not-found' && (
              <Text color="red600" variant="eyebrow" lineHeight="lg">
                {formatMessage(m.caseNotFoundInCourt)}
              </Text>
            )}
          </Box>
        )
      })}
      <AnimatePresence>
        {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
      </AnimatePresence>
    </>
  )
}

export default CaseFileList
