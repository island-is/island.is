import {
  ActionCard,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Box,
  Breadcrumbs,
  AlertMessage,
  Divider,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { m } from '../../lib/messages'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../lib/paths'
import CompareLists from '../../shared-components/compareLists'
import { ListsLoaderReturn } from '../../loaders/AllLists.loader'
import {
  CollectionStatus,
  SignatureCollectionCollectionType,
} from '@island.is/api/schema'
import ActionCompleteCollectionProcessing from '../../shared-components/completeCollectionProcessing'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import FindSignature from '../../shared-components/findSignature'
import EmptyState from '../../shared-components/emptyState'

const collectionType = SignatureCollectionCollectionType.Parliamentary

const ParliamentaryRoot = () => {
  const { formatMessage } = useLocale()

  const navigate = useNavigate()
  const { collection, collectionStatus, allLists } =
    useLoaderData() as ListsLoaderReturn

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
                },
              ]}
            />
          </Box>
          <IntroHeader
            title={formatMessage(m.parliamentaryCollectionTitle)}
            intro={formatMessage(m.parliamentaryCollectionIntro)}
            imgPosition="right"
            imgHiddenBelow="sm"
            img={nationalRegistryLogo}
            marginBottom={4}
          />
          <Divider />
          <Box marginTop={9} />
          {allLists.length === 0 ? (
            <EmptyState
              title={formatMessage(m.noLists)}
              description={formatMessage(m.noListsDescription)}
            />
          ) : (
            <Box>
              <FindSignature collectionId={collection.id} />
              <Stack space={3}>
                {collection?.areas.map((area) => {
                  const areaLists = allLists.filter(
                    (l) => l.area.name === area.name,
                  )
                  return (
                    <ActionCard
                      key={area.id}
                      eyebrow={
                        formatMessage(m.totalListsPerConstituency) +
                        areaLists.length
                      }
                      heading={area.name}
                      cta={{
                        label: formatMessage(m.viewConstituency),
                        variant: 'text',
                        icon: 'arrowForward',
                        disabled: areaLists.length === 0,
                        onClick: () => {
                          navigate(
                            SignatureCollectionPaths.ParliamentaryConstituency.replace(
                              ':constituencyName',
                              area.name,
                            ),
                          )
                        },
                      }}
                      tag={
                        areaLists.length > 0 &&
                        areaLists.every((l) => l.reviewed === true)
                          ? {
                              label: formatMessage(m.confirmListReviewed),
                              variant: 'mint',
                              outlined: true,
                            }
                          : undefined
                      }
                    />
                  )
                })}
              </Stack>
              <CompareLists
                collectionId={collection?.id}
                collectionType={collectionType}
              />
              <ActionCompleteCollectionProcessing
                collectionType={collectionType}
                collectionId={collection?.id}
                canProcess={
                  !!allLists.length &&
                  allLists.every((l) => l.reviewed === true)
                }
              />
            </Box>
          )}
          {collectionStatus === CollectionStatus.Processed && (
            <Box marginTop={8}>
              <AlertMessage
                type="success"
                title={formatMessage(m.collectionProcessedTitle)}
                message={formatMessage(m.collectionProcessedMessage)}
              />
            </Box>
          )}
          {collectionStatus === CollectionStatus.InReview && (
            <Box marginTop={8}>
              <AlertMessage
                type="success"
                title={formatMessage(m.collectionReviewedTitle)}
                message={formatMessage(m.collectionReviewedMessage)}
              />
            </Box>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ParliamentaryRoot
