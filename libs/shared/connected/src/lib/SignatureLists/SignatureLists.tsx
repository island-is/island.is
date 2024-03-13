import { Box, Text, Stack, ActionCard } from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { FC } from 'react'
import {
  ConnectedComponent,
  SignatureCollectionCandidate,
  SignatureCollectionListBase,
} from '@island.is/api/schema'
import { useLocalization } from '../../utils'
import {
  useGetCurrentCollection,
  useGetOpenLists,
} from './useGetSignatureLists'
import { sortAlpha } from '@island.is/shared/utils'

interface SignatureListsProps {
  slice: ConnectedComponent
}

export const SignatureLists: FC<
  React.PropsWithChildren<SignatureListsProps>
> = ({ slice }) => {
  const { collection, loading } = useGetCurrentCollection()
  const { openLists, openListsLoading } = useGetOpenLists(collection?.id || '')
  const t = useLocalization(slice.json)

  return (
    !loading &&
    !openListsLoading && (
      <Box marginTop={10}>
        {(collection?.candidates.length > 0 || openLists?.length > 0) && (
          <Box
            marginBottom={3}
            display={'flex'}
            justifyContent={'spaceBetween'}
            alignItems={'baseline'}
          >
            {collection.isActive ? (
              <>
                <Text variant="h3">{t('title1', 'Forsetakosningar 2024')}</Text>
                <Text variant="eyebrow">
                  {t('totalCandidates', 'Fjöldi frambjóðenda: ') +
                    collection?.candidates.length}
                </Text>
              </>
            ) : (
              <>
                <Text variant="h3">
                  {t('title2', 'Forsetakosningar 2024 - Framlengt')}
                </Text>
                <Text variant="eyebrow">
                  {t('totalLists', 'Fjöldi lista: ') + openLists?.length}
                </Text>
              </>
            )}
          </Box>
        )}
        <Stack space={3}>
          {/* if collection time is over yet there are still open lists, show them */}
          {!collection?.isActive && openLists?.length > 0 ? (
            [...openLists]
              ?.sort(sortAlpha('title'))
              .map((list: SignatureCollectionListBase) => {
                return (
                  <ActionCard
                    eyebrow={
                      t('openTil', 'Lokadagur:') +
                      ' ' +
                      format(new Date(list.endTime), 'dd.MM.yyyy')
                    }
                    key={list.id}
                    backgroundColor="white"
                    heading={list.title}
                    cta={{
                      label: t('sign', 'Mæla með framboði'),
                      variant: 'text',
                      icon: 'open',
                      iconType: 'outline',
                      size: 'small',
                      onClick: () =>
                        window.open(
                          `${window.location.origin}${list.slug}`,
                          '_blank',
                        ),
                    }}
                  />
                )
              })
          ) : collection?.candidates?.length > 0 ? (
            [...collection.candidates]
              ?.sort(sortAlpha('name'))
              .map((candidate: SignatureCollectionCandidate) => {
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
                    cta={
                      collection.isActive
                        ? {
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
                          }
                        : undefined
                    }
                    tag={
                      !collection.isActive
                        ? {
                            label: t('closed', 'Söfnuninni lokið'),
                            variant: 'red',
                          }
                        : undefined
                    }
                  />
                )
              })
          ) : (
            <Text variant="h4">
              {t('noLists', 'Engin meðmælasöfnun er í gangi í augnablikinu.')}
            </Text>
          )}
        </Stack>
      </Box>
    )
  )
}

export default SignatureLists
