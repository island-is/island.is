import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  ActionCard,
  Box,
  Breadcrumbs,
  DialogPrompt,
  Icon,
  Tag,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import {
  useLoaderData,
  useNavigate,
  useParams,
  useRevalidator,
} from 'react-router-dom'
import { SignatureCollectionPaths } from '../../lib/paths'
import { ListsLoaderReturn } from '../../loaders/AllLists.loader'
import CreateCollection from '../../shared-components/createCollection'
import format from 'date-fns/format'
import electionsCommitteeLogo from '../../../assets/electionsCommittee.svg'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import { useSignatureCollectionAdminRemoveListMutation } from './removeList.generated'
import { useSignatureCollectionAdminRemoveCandidateMutation } from './removeCandidate.generated'
import { getTagConfig } from '../../lib/utils'
import {
  SignatureCollectionCollectionType,
  SignatureCollectionList,
} from '@island.is/api/schema'

export const Constituency = ({
  allowedToProcess,
}: {
  allowedToProcess: boolean
}) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { revalidate } = useRevalidator()

  const { collection, allLists } = useLoaderData() as ListsLoaderReturn
  const { constituencyName } = useParams() as { constituencyName: string }

  const constituencyLists = allLists.filter(
    (list) => list.area.name === constituencyName,
  )

  const areaId = collection.areas.find((a) => a.name === constituencyName)?.id

  const countCandidatesLists = (allLists: SignatureCollectionList[]) => {
    return allLists?.reduce(
      (acc: Record<string, number>, list: SignatureCollectionList) => {
        acc[list.candidate.id] = (acc[list.candidate.id] || 0) + 1
        return acc
      },
      {},
    )
  }

  const candidatesListCount = countCandidatesLists(allLists)

  const [removeList] = useSignatureCollectionAdminRemoveListMutation({
    onCompleted: () => {
      toast.success(formatMessage(m.cancelCollectionModalToastSuccess))
      revalidate()
    },
    onError: () => {
      toast.error(formatMessage(m.cancelCollectionModalToastError))
    },
  })

  const [removeCandidate] = useSignatureCollectionAdminRemoveCandidateMutation()

  return (
    <GridContainer>
      <GridRow direction="row">
        <GridColumn
          span={['12/12', '5/12', '5/12', '3/12']}
          offset={['0', '7/12', '7/12', '0']}
        >
          <PortalNavigation
            navigation={signatureCollectionNavigation}
            title={formatMessage(m.signatureListsTitle)}
          />
        </GridColumn>
        <GridColumn
          paddingTop={[5, 5, 5, 0]}
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '8/12']}
        >
          <Box marginBottom={3}>
            <Breadcrumbs
              items={[
                {
                  title: formatMessage(m.parliamentaryCollectionTitle),
                  href: `/stjornbord${SignatureCollectionPaths.ParliamentaryRoot}`,
                },
                {
                  title: constituencyName,
                },
              ]}
            />
          </Box>
          <IntroHeader
            title={constituencyName}
            intro={
              formatMessage(m.parliamentaryConstituencyIntro) +
              ' ' +
              constituencyName
            }
            imgPosition="right"
            imgHiddenBelow="sm"
            img={
              allowedToProcess ? electionsCommitteeLogo : nationalRegistryLogo
            }
          />
          <GridRow>
            <GridColumn span={'12/12'}>
              <Box
                marginBottom={3}
                display="flex"
                justifyContent="spaceBetween"
                alignItems="flexEnd"
              >
                <Text variant="eyebrow">
                  {formatMessage(m.totalListResults) +
                    ': ' +
                    constituencyLists.length}
                </Text>
                <CreateCollection
                  collectionId={collection?.id}
                  collectionType={
                    SignatureCollectionCollectionType.Parliamentary
                  }
                  areaId={areaId}
                />
              </Box>
              <Stack space={3}>
                {constituencyLists.map((list) => (
                  <ActionCard
                    key={list.id}
                    date={format(new Date(list.endTime), 'dd.MM.yyyy HH:mm')}
                    heading={list.candidate.name}
                    progressMeter={{
                      currentProgress: list.numberOfSignatures ?? 0,
                      maxProgress: list.area.min,
                      withLabel: true,
                    }}
                    cta={{
                      label: formatMessage(m.viewList),
                      variant: 'text',
                      onClick: () => {
                        navigate(
                          SignatureCollectionPaths.ParliamentaryConstituencyList.replace(
                            ':constituencyName',
                            constituencyName,
                          ).replace(':listId', list.id),
                        )
                      },
                    }}
                    tag={
                      allowedToProcess
                        ? {
                            ...getTagConfig(list),
                            renderTag: (cld) => (
                              <Box
                                display="flex"
                                alignItems="center"
                                columnGap={1}
                              >
                                {cld}
                                <DialogPrompt
                                  baseId="cancel_collection_dialog"
                                  title={
                                    formatMessage(m.cancelCollectionButton) +
                                    ' - ' +
                                    list.area?.name
                                  }
                                  description={
                                    candidatesListCount[list.candidate.id] === 1
                                      ? formatMessage(
                                          m.cancelCollectionModalMessageLastList,
                                        )
                                      : formatMessage(
                                          m.cancelCollectionModalMessage,
                                        )
                                  }
                                  ariaLabel="delete"
                                  disclosureElement={
                                    <Tag outlined variant="red">
                                      <Box display="flex" alignItems="center">
                                        <Icon
                                          icon="trash"
                                          size="small"
                                          type="outline"
                                        />
                                      </Box>
                                    </Tag>
                                  }
                                  onConfirm={() => {
                                    removeList({
                                      variables: {
                                        input: {
                                          listId: list.id,
                                          collectionType:
                                            SignatureCollectionCollectionType.Parliamentary,
                                        },
                                      },
                                    })

                                    if (
                                      candidatesListCount[list.candidate.id] ===
                                      1
                                    ) {
                                      removeCandidate({
                                        variables: {
                                          input: {
                                            candidateId: list.candidate.id,
                                          },
                                        },
                                      })
                                    }
                                  }}
                                  buttonTextConfirm={
                                    candidatesListCount[list.candidate.id] === 1
                                      ? formatMessage(
                                          m.cancelCollectionAndCandidateModalConfirmButton,
                                        )
                                      : formatMessage(
                                          m.cancelCollectionModalConfirmButton,
                                        )
                                  }
                                  buttonPropsConfirm={{
                                    variant: 'primary',
                                    colorScheme: 'destructive',
                                  }}
                                  buttonTextCancel={formatMessage(
                                    m.cancelCollectionModalCancelButton,
                                  )}
                                />
                              </Box>
                            ),
                          }
                        : undefined
                    }
                  />
                ))}
              </Stack>
            </GridColumn>
          </GridRow>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Constituency
