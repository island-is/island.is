import { FormSystemField } from '@island.is/api/schema'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { Dispatch } from 'react'
import { Action } from '../../../lib'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang?: 'is' | 'en'
  hasError?: boolean
}

export const MessageWithLink = ({ item }: Props) => {
  const formatUrl = (url: string): string => {
    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://')
    } else if (!url.startsWith('https://')) {
      url = 'https://' + url
    }
    return url
  }

  return (
    <Box
      flexDirection="row"
      display="flex"
      padding={4}
      background="white"
      alignItems="center"
    >
      <Box display="flex" flexDirection="column">
        <Box paddingBottom={1}>
          <Text variant="h4">{item?.name?.is}</Text>
        </Box>
        <Box overflow="initial">
          <Text>{item?.description?.is}</Text>
        </Box>
      </Box>
      {item.fieldSettings?.hasLink && (
        <Box
          alignItems="center"
          marginLeft="auto"
          style={{ top: '50%' }}
          paddingLeft={1}
        >
          <Button
            onClick={() => {
              window.open(formatUrl(item.fieldSettings?.url ?? ''), '_blank')
            }}
            size="small"
            icon="open"
            variant="ghost"
          >
            {item?.fieldSettings?.buttonText?.is}
          </Button>
        </Box>
      )}
    </Box>
  )
}
