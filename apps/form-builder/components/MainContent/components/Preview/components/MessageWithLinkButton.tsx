import { Box, Button, Text } from '@island.is/island-ui/core'
import { useContext } from 'react'
import FormBuilderContext from '../../../../../context/FormBuilderContext'
import { ILanguage, IInput } from '../../../../../types/interfaces'

interface Props {
  settings: {
    url?: string
    hnapptexti?: ILanguage
    erHlekkur?: boolean
  }
  data: IInput
}

export function MessageWithLinkButton({ settings, data }: Props) {
  const { lists } = useContext(FormBuilderContext)
  const { activeItem } = lists
  console.log(activeItem)
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
          <Text variant="h4">{data.name.is}</Text>
        </Box>
        <Box overflow="initial">
          <Text>{data.description.is}</Text>
        </Box>
      </Box>
      {settings?.erHlekkur && (
        <Box
          alignItems="center"
          style={{ top: '50%', marginLeft: 'auto' }}
          paddingLeft={1}
        >
          <Button
            onClick={() => {
              window.open(formatUrl(settings?.url), '_blank')
            }}
            size="small"
            icon="open"
            variant="ghost"
          >
            {settings.hnapptexti?.is}
          </Button>
        </Box>
      )}
    </Box>
  )

  function formatUrl(url: string): string {
    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://')
    } else if (!url.startsWith('https://')) {
      url = 'https://' + url
    }
    return url
  }
}
