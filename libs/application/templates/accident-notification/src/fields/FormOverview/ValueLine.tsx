import { MessageDescriptor } from 'react-intl'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, Text, Button } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'

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
  files:
    | {
        url?: string | undefined
        name: string
        key: string
      }[]
    | undefined
}

export const FileValueLine: FC<FileValueLineProps> = ({ label, files }) => {
  const { formatMessage } = useLocale()

  if (!files || files.length === 0) return null

  return (
    <Box paddingBottom={3}>
      <Text variant="h5">{formatMessage(label)}</Text>
      <Box display="flex" flexWrap="wrap">
        {files?.map((file, index) => (
          <Box key={`${file.name}-${index}`} marginRight={2} marginBottom={1}>
            <Button variant="text" icon="document" iconType="outline">
              {file.name}
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
