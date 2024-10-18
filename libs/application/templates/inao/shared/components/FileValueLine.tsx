import { ActionCard, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'

type Props = {
  label?: string
  files: MessageDescriptor
}

export const FileValueLine = ({ label = '', files }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingY={2}>
      <Text variant="h3">{formatMessage(files)}</Text>
      <Box paddingY={2}>
        <ActionCard
          heading={label}
          headingVariant="h4"
          cta={{
            label: '',
          }}
          tag={{
            label: 'PDF',
          }}
          backgroundColor="blue"
        />
      </Box>
    </Box>
  )
}
