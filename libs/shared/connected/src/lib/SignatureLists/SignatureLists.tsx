import { Box, Text, Stack, ActionCard } from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { FC } from 'react'
import {
  ConnectedComponent,
  SignatureCollectionList,
} from '@island.is/api/schema'
import { useLocalization } from '../../utils'
import { useGetSignatureLists } from './useGetSignatureLists'

interface SignatureListsProps {
  slice: ConnectedComponent
}

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

export const SignatureLists: FC<
  React.PropsWithChildren<SignatureListsProps>
> = ({ slice }) => {
  const { lists, loading } = useGetSignatureLists()
  const t = useLocalization(slice.json)

  return (
    <>
      {!loading && lists?.length > 0 && (
        <Box>
          <Box marginBottom={3}>
            <Text variant="h4">
              {t('title', 'Frambjóðendur sem hægt er að mæla með')}
            </Text>
          </Box>
          <Stack space={4}>
            {lists?.length > 0 &&
              lists.map((list: SignatureCollectionList) => {
                return (
                  <ActionCard
                    eyebrow={
                      t('openTil', 'Lokadagur:') +
                      ' ' +
                      formatDate(list.endTime)
                    }
                    key={list.title}
                    backgroundColor="white"
                    heading={list.title}
                    text={t('collectionTitle', 'Forsetakosningar 2024')}
                    cta={{
                      label: t('sign', 'Mæla með framboði'),
                      variant: 'text',
                      icon: 'open',
                      iconType: 'outline',
                      size: 'small',
                      onClick: () =>
                        window.open(
                          `${window.location.origin}/umsoknir/maela-med-lista`,
                          '_blank',
                        ),
                    }}
                  />
                )
              })}
          </Stack>
        </Box>
      )}
    </>
  )
}

export default SignatureLists
