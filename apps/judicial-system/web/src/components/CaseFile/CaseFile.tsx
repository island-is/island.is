import React from 'react'
import isValid from 'date-fns/isValid'

import { Box, Tag, Text } from '@island.is/island-ui/core'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'

import { kb } from '../../utils/stepHelper'
import BlueBox from '../BlueBox/BlueBox'
import * as styles from './CaseFile.css'

interface Props {
  fileId: string
  name: string
  size: number
  uploadedAt: string
  onOpen: (id: string) => void
  canOpenFiles?: boolean
}

const CaseFile: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { fileId, name, size, uploadedAt, canOpenFiles = true, onOpen } = props

  const isValidUpdatedAtDate = isValid(new Date(uploadedAt))

  return (
    <BlueBox size="small">
      <div className={styles.CaseFileContainer}>
        <div className={styles.CaseFileNameContainer}>
          <div className={styles.CaseFileName}>
            <Text fontWeight="semiBold" truncate>
              {name}
            </Text>
          </div>
          <Text>{`(${kb(size)}KB)`}</Text>
        </div>
        <Box display="flex" alignItems="center">
          {isValidUpdatedAtDate && (
            <div className={styles.CaseFileCreatedContainer}>
              <Text variant="small">{`${formatDate(
                uploadedAt,
                'd.M.y',
              )} kl. ${formatDate(uploadedAt, TIME_FORMAT)}`}</Text>
            </div>
          )}
          {canOpenFiles && (
            <Tag variant="darkerBlue" onClick={() => onOpen(fileId)}>
              Opna
            </Tag>
          )}
        </Box>
      </div>
    </BlueBox>
  )
}

export default CaseFile
