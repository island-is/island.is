import { ActionCard, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'

const SigneeView = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text marginBottom={3} variant="h4">
        {formatMessage(m.mySigneeListsHeader)}
      </Text>
      <ActionCard
        backgroundColor="white"
        heading={'Listi A - Reykjavík norður'}
        eyebrow={'Skrifað undir: 07.04.2024'}
        text={formatMessage(m.parliamentaryElectionsTitle)}
        tag={{
          label: formatMessage(m.collectionClosed),
          variant: 'red',
          outlined: true,
        }}
      />
    </Box>
  )
}

export default SigneeView
