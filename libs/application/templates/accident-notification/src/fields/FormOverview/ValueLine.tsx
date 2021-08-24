import { MessageDescriptor } from 'react-intl'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import {
  Box,
  Text,
  Button,
  BulletList,
  Bullet,
} from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'
import { FileType } from '../../types'

interface ValueLineProps {
  label: string | MessageDescriptor
  value: string | MessageDescriptor
  color?: Colors
}

export const ValueLine: FC<ValueLineProps> = ({ label, value, color }) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingBottom={3}>
      <Text variant="h5">{formatMessage(label)}</Text>
      <Text color={color}>{formatMessage(value)}</Text>
    </Box>
  )
}

interface FileValueLineProps {
  label: string | MessageDescriptor
  files: FileType[] | undefined
}

export const FileValueLine: FC<FileValueLineProps> = ({ label, files }) => {
  const { formatMessage } = useLocale()

  if (!files || files.length === 0) return null

  return (
    <Box paddingBottom={3}>
      <Text variant="h5" marginBottom={[2, 2, 3]}>
        {formatMessage(label)}
      </Text>
      <BulletList space={1} type="ul">
        {files?.map((file, index) => (
          <Bullet key={`${file.name}-${index}`}>{file.name}</Bullet>
        ))}
      </BulletList>
    </Box>
  )
}
