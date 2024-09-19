import { ActionCard, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'

type Props = {
  label?: string
}

export const FileValueLine = ({ label = '' }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingY={2}>
      <Text variant="h3">{formatMessage(m.files)}</Text>
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
