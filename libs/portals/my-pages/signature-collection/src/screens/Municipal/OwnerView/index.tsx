import { ActionCard, Stack, Text, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import Managers from '../../shared/Managers'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'

const collectionType = SignatureCollectionCollectionType.LocalGovernmental

const OwnerView = () => {
  const { formatMessage } = useLocale()

  return (
    <Stack space={6}>
      <Box>
        <Text variant="h4" marginBottom={3}>
          {formatMessage(m.myListsDescription)}
        </Text>
        <ActionCard
          backgroundColor="white"
          heading="Borgarbyggð"
          progressMeter={{
            currentProgress: 0,
            maxProgress: 0,
            withLabel: true,
          }}
          eyebrow="Framboð A"
          text="Stofnandi söfnunar: Jón Jónsson"
          cta={{
            label: formatMessage(m.viewList),
            variant: 'text',
            icon: 'arrowForward',
            onClick: () => {
              console.log('viewing list')
            },
          }}
          tag={{
            label: formatMessage(m.collectionIsActive),
            variant: 'blue',
            outlined: false,
          }}
        />
      </Box>
      <Managers collectionType={collectionType} />
    </Stack>
  )
}

export default OwnerView
