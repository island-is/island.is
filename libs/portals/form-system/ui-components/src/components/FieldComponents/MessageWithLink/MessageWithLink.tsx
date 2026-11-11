import { FormSystemField } from '@island.is/api/schema'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch } from 'react'
import HtmlParser from 'react-html-parser'
import sanitizeHtml from 'sanitize-html'
import { Action } from '../../../lib'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
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
  const { lang } = useLocale()
  return (
    <Box
      flexDirection="column"
      display="flex"
      background="white"
      alignItems="stretch"
    >
      <Box
        display="flex"
        flexDirection="column"
        style={{ flex: 1, minWidth: 0 }}
      >
        <Box paddingBottom={1}>
          <Text variant="h4">{item?.name?.[lang]}</Text>
        </Box>
        <Box overflow="hidden">
          <Text whiteSpace="breakSpaces" textAlign="justify">
            {HtmlParser(
              sanitizeHtml(item?.description?.[lang] ?? '', {
                allowedTags: ['em', 'strong'],
                allowedAttributes: {},
              }),
            )}
          </Text>
        </Box>
      </Box>
      {item.fieldSettings?.hasLink && (
        <Box display="flex" justifyContent="flexEnd" paddingTop={1}>
          <Button
            onClick={() => {
              window.open(formatUrl(item.fieldSettings?.url ?? ''), '_blank')
            }}
            size="small"
            icon="open"
            variant="ghost"
          >
            {item?.fieldSettings?.buttonText?.[lang]}
          </Button>
        </Box>
      )}
    </Box>
  )
}
