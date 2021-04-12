import React from 'react'
import { Box, Tag, Text, UploadFile } from '@island.is/island-ui/core'
import BlueBox from '../BlueBox/BlueBox'
import { kb } from '../../utils/stepHelper'
import { formatDate, TIME_FORMAT } from '@island.is/judicial-system/formatters'
import isValid from 'date-fns/isValid'

import * as styles from './CaseFile.treat'

interface Props {
  name: string
  size: number
  uploadedAt: string
  onOpen: () => void
}

const CaseFile: React.FC<Props> = (props) => {
  const { name, size, uploadedAt, onOpen } = props

  const isValidUpdatedAtDate = isValid(new Date(uploadedAt))

  return (
    <BlueBox size="small">
      <Box display="flex" justifyContent="spaceBetween">
        <Box display="flex" alignItems="center">
          <div className={styles.CaseFileNameContainer}>
            <Text fontWeight="semiBold" truncate>
              {name}
            </Text>
          </div>
          <Text>{`(${kb(size)}KB)`}</Text>
        </Box>
        <Box display="flex" alignItems="center">
          {isValidUpdatedAtDate && (
            <Box marginRight={2}>
              <Text variant="small">{`${formatDate(
                uploadedAt,
                'd.M.y',
              )} kl. ${formatDate(uploadedAt, TIME_FORMAT)}`}</Text>
            </Box>
          )}
          <Tag variant="darkerBlue" onClick={onOpen}>
            Opna
          </Tag>
        </Box>
      </Box>
    </BlueBox>
  )
}

export default CaseFile
