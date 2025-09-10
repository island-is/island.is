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
  SignatureCollectionCollectionType,
  SignatureCollectionCandidate,
} from '@island.is/api/schema'
import { useLocalization } from '../../utils'
import { useGetLatestCollectionForType } from './useGetSignatureLists'
import { sortAlpha } from '@island.is/shared/utils'

interface SignatureListsProps {
  slice: ConnectedComponent
  collectionType: SignatureCollectionCollectionType
}

export const SignatureLists: FC<
  React.PropsWithChildren<SignatureListsProps>
> = ({ slice, collectionType }) => {
  const t = useLocalization(slice.json)

  const { collection, loading } = useGetLatestCollectionForType(collectionType)
  const hasCandidates = collection?.candidates?.length > 0
  const isLocalGov =
    collectionType === SignatureCollectionCollectionType.LocalGovernmental

  return !loading ? (
    <Box marginY={5}>
      <Box
        marginBottom={5}
        display={['block', 'flex']}
        justifyContent="spaceBetween"
        alignItems="baseline"
      >
        <Text variant="h3">{t('title', 'Yfirlit framboða')}</Text>
        <Text variant="eyebrow">
          {t('totalCandidates', 'Fjöldi framboða: ') +
            collection?.candidates.length}
        </Text>
      </Box>

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
                        eyebrow={
                          t('openTil', 'Lokadagur:') +
                          ' ' +
                          format(new Date(collection.endTime), 'dd.MM.yyyy')
                        }
                        text={`${t(
                          'candidateOwnerName',
                          'Stofnandi söfnunar: ',
                        )}${candidate?.ownerName ?? ''} (${format(
                          new Date(candidate?.ownerBirthDate),
                          'dd.MM.yyyy',
                        )})`}
                        cta={
                          candidate.hasActiveLists
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
                          !candidate.hasActiveLists
                            ? {
                                label: t('closed', 'Söfnun lokið'),
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
          {hasCandidates ? (
            [...collection.candidates]
              ?.sort(sortAlpha('name'))
              .map((candidate: SignatureCollectionCandidate) => {
                return (
                  <ActionCard
                    key={candidate.id}
                    heading={candidate.name}
                    eyebrow={
                      t('openTil', 'Lokadagur:') +
                      ' ' +
                      format(new Date(collection.endTime), 'dd.MM.yyyy')
                    }
                    cta={
                      candidate.hasActiveLists
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
                      !candidate.hasActiveLists
                        ? {
                            label: t('closed', 'Söfnun lokið'),
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
