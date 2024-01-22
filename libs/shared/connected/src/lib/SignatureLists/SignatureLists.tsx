import { Box, Text, Stack, ActionCard } from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { FC } from 'react'
import {
  ConnectedComponent,
  SignatureCollectionCandidate,
} from '@island.is/api/schema'
import { useLocalization } from '../../utils'
import { useGetCurrentCollection } from './useGetSignatureLists'

interface SignatureListsProps {
  slice: ConnectedComponent
}

export const SignatureLists: FC<
  React.PropsWithChildren<SignatureListsProps>
> = ({ slice }) => {
  const { collection, loading } = useGetCurrentCollection()
  const t = useLocalization(slice.json)

  return (
    !loading &&
    collection?.candidates.length > 0 && (
      <Box marginTop={7}>
        <Box marginBottom={3}>
          <Text variant="h4">
            {t('title', 'Frambjóðendur sem hægt er að mæla með')}
          </Text>
        </Box>
        <Stack space={4}>
          {collection?.candidates?.length > 0 &&
            collection.candidates.map(
              (candidate: SignatureCollectionCandidate) => {
                return (
                  <ActionCard
                    eyebrow={
                      t('openTil', 'Lokadagur:') +
                      ' ' +
                      format(new Date(collection.endTime), 'dd.MM.yyyy')
                    }
                    key={candidate.id}
                    backgroundColor="white"
                    heading={candidate.name}
                    text={collection.name}
                    cta={{
                      label: t('sign', 'Mæla með framboði'),
                      variant: 'text',
                      icon: 'open',
                      iconType: 'outline',
                      size: 'small',
                      onClick: () =>
                        window.open(
                          `${window.location.origin}/umsoknir/maela-med-frambodi/?candidate=${candidate.id}`,
                          '_blank',
                        ),
                    }}
                  />
                )
              },
            )}
        </Stack>
      </Box>
    )
  )
}

export default SignatureLists
