import {
  Box,
  Text,
  Stack,
  ActionCard,
  SkeletonLoader,
  AccordionItem,
  Accordion,
} from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { FC } from 'react'
import {
  ConnectedComponent,
  SignatureCollectionListBase,
  SignatureCollectionCollectionType,
  SignatureCollectionCandidate,
} from '@island.is/api/schema'
import { useLocalization } from '../../utils'
import {
  useGetLatestCollectionForType,
  useGetOpenLists,
} from './useGetSignatureLists'
import { sortAlpha } from '@island.is/shared/utils'

interface SignatureListsProps {
  slice: ConnectedComponent
  collectionType: SignatureCollectionCollectionType
}

export const SignatureLists: FC<
  React.PropsWithChildren<SignatureListsProps>
> = ({ slice, collectionType }) => {
  const { collection, loading } = useGetLatestCollectionForType(collectionType)
  const { openLists, openListsLoading } = useGetOpenLists(collection)
  const t = useLocalization(slice.json)

  const hasCandidates = collection?.candidates?.length > 0
  const hasLists = openLists?.length > 0
  const isLocalGov =
    collectionType === SignatureCollectionCollectionType.LocalGovernmental

  const CollectionHeader = () => {
    if (!(hasCandidates || hasLists)) return null

    return (
      <Box
        marginBottom={5}
        display={['block', 'flex']}
        justifyContent="spaceBetween"
        alignItems="baseline"
      >
        {collection?.isActive ? (
          <>
            <Text variant="h3">{t('title', 'Forsetakosningar 2024')}</Text>
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
              {t('totalLists', 'Fjöldi lista: ') + (openLists?.length ?? 0)}
            </Text>
          </>
        )}
      </Box>
    )
  }

  return !loading && !openListsLoading ? (
    <Box marginY={5}>
      <CollectionHeader />

      {/* Sveitó - Accordion setup */}
      {isLocalGov ? (
        <Accordion>
          {[...(collection?.areas || [])]
            // alphabetical order
            .sort((a, b) => a.name.localeCompare(b.name))
            // keep only areas with items
            .filter((area) =>
              collection?.candidates?.some(
                (candidate) => candidate.areaId === area.id,
              ),
            )
            .map((area) => (
              <AccordionItem id="test" label={area.name} key={area.id}>
                {collection?.candidates
                  ?.filter((candidate) => candidate.areaId === area.id)
                  .map((candidate) => (
                    <Box marginBottom={3} key={candidate.id}>
                      <ActionCard
                        heading={candidate.name}
                        eyebrow={area.name}
                        text={`${t(
                          'candidateOwnerName',
                          'Stofnandi söfnunar: ',
                        )}${candidate?.ownerName ?? ''} (${format(
                          new Date(candidate?.ownerBirthDate),
                          'dd.MM.yyyy',
                        )})`}
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
                                    `${
                                      window.location.origin
                                    }/umsoknir/${'maela-med-sveitarstjornarframbodi'}/?candidate=${
                                      candidate.id
                                    }`,
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
                    </Box>
                  ))}
              </AccordionItem>
            ))}
        </Accordion>
      ) : (
        <Stack space={3}>
          {/* ATH - þarf að tékka þetta setup með openLists eftir endTime fyrir sveitó */}
          {/* if collection time is over yet there are still open lists, show them */}
          {!collection?.isActive && hasLists ? (
            [...openLists]
              ?.sort(sortAlpha('title'))
              .map((list: SignatureCollectionListBase) => {
                return (
                  <ActionCard
                    eyebrow={
                      t('openTil', 'Lokadagur:') +
                      ' ' +
                      format(new Date(list.endTime), 'dd.MM.yyyy HH:mm')
                    }
                    key={list.id}
                    backgroundColor="white"
                    heading={list.title.split(' -')[0]}
                    text={list.area?.name}
                    cta={
                      list.active
                        ? {
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
                          }
                        : undefined
                    }
                  />
                )
              })
          ) : hasCandidates ? (
            [...collection.candidates]
              ?.sort(sortAlpha('name'))
              .map((candidate: SignatureCollectionCandidate) => {
                return (
                  <ActionCard
                    key={candidate.id}
                    backgroundColor="white"
                    heading={candidate.name}
                    eyebrow={
                      t('openTil', 'Lokadagur:') +
                      ' ' +
                      format(new Date(collection.endTime), 'dd.MM.yyyy')
                    }
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
                                `${window.location.origin}/umsoknir/${
                                  collectionType ===
                                  SignatureCollectionCollectionType.Presidential
                                    ? 'maela-med-frambodi'
                                    : 'maela-med-althingisframbodi'
                                }/?candidate=${candidate.id}`,
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
      )}
    </Box>
  ) : (
    <SkeletonLoader height={110} repeat={4} space={3} />
  )
}

export default SignatureLists
