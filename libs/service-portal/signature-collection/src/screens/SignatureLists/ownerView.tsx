import { ActionCard, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { SignatureCollectionPaths } from '../../lib/paths'
import { LinkResolver } from '@island.is/service-portal/core'
import { mockLists } from '../../lib/utils'
import CancelCollection from './cancelCollection'

const OwnerView = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginTop={10}>
        <Text variant="h4" marginBottom={3}>
          {formatMessage(m.myListsHeader)}
        </Text>
        <Stack space={5}>
          {mockLists.map((list) => {
            return (
              <LinkResolver
                key={list.id}
                href={SignatureCollectionPaths.ViewList.replace(
                  ':listId',
                  list.id,
                )}
              >
                <ActionCard
                  backgroundColor="white"
                  heading={list.name}
                  eyebrow="Lokadagur: 15.05.2024"
                  text={formatMessage(m.collectionTitle)}
                  cta={{
                    label: formatMessage(m.viewList),
                    variant: 'text',
                    icon: 'arrowForward',
                  }}
                  progressMeter={{
                    currentProgress: list.progress,
                    maxProgress: 350,
                    withLabel: true,
                  }}
                />
              </LinkResolver>
            )
          })}
        </Stack>
      </Box>
      <CancelCollection />
    </Box>
  )
}

export default OwnerView
