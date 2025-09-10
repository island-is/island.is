import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  ActionCard,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
  Breadcrumbs,
  Divider,
  AlertMessage,
} from '@island.is/island-ui/core'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { SignatureCollectionPaths } from '../../lib/paths'
import { ListsLoaderReturn } from '../../loaders/AllLists.loader'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import { replaceParams } from '@island.is/react-spa/shared'
import { getTagConfig } from '../../lib/utils'
import CompareLists from '../../shared-components/compareLists'
import ActionDrawer from '../../shared-components/actionDrawer'
import { Actions } from '../../shared-components/actionDrawer/ListActions'
import EmptyState from '../../shared-components/emptyState'
import { CollectionStatus } from '@island.is/api/schema'

export const Municipality = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { collection, collectionStatus, allLists } =
    useLoaderData() as ListsLoaderReturn
  const params = useParams()

  const municipality = params.municipality ?? ''
  const municipalityLists = allLists.filter(
    (list) => list.area.name === municipality,
  )

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
                  title: formatMessage(m.municipalCollectionTitle),
                  href: `/stjornbord${SignatureCollectionPaths.MunicipalRoot}`,
                },
                {
                  title: municipality,
                },
              ]}
            />
          </Box>
          <IntroHeader
            title={formatMessage(m.municipalCollectionTitle)}
            intro={formatMessage(m.municipalCollectionIntro)}
            imgPosition="right"
            imgHiddenBelow="sm"
            img={nationalRegistryLogo}
            buttonGroup={
              <ActionDrawer
                allowedActions={[
                  Actions.DownloadReports,
                  Actions.CreateCollection,
                  Actions.CompleteCollectionProcessing,
                ]}
              />
            }
            marginBottom={4}
          />
          {collectionStatus === CollectionStatus.Processed && (
            <Box marginY={3}>
              <AlertMessage
                type="success"
                title={formatMessage(m.collectionProcessedTitle)}
                message={formatMessage(m.collectionProcessedMessage)}
              />
            </Box>
          )}
          {collectionStatus === CollectionStatus.InReview && (
            <Box marginY={3}>
              <AlertMessage
                type="success"
                title={formatMessage(m.collectionMunicipalReviewedTitle)}
                message={formatMessage(m.collectionMunicipalReviewedMessage)}
              />
            </Box>
          )}
          <Divider />
          <Box marginTop={9} />
          {municipalityLists.length === 0 ? (
            <EmptyState
              title={formatMessage(m.noLists) + ' í ' + municipality}
              description={formatMessage(m.noListsDescription)}
            />
          ) : (
            <GridRow>
              <GridColumn span="12/12">
                <Box display="flex" justifyContent="flexEnd" marginBottom={3}>
                  <Text variant="eyebrow">
                    {formatMessage(m.totalListResults) +
                      ': ' +
                      municipalityLists.length}
                  </Text>
                </Box>
                <Stack space={3}>
                  {municipalityLists.map((list) => (
                    <ActionCard
                      key={list.id}
                      eyebrow={municipality}
                      heading={list.candidate.name}
                      text={
                        formatMessage(m.numberOfSignatures) +
                        ': ' +
                        list.numberOfSignatures
                      }
                      cta={{
                        label: formatMessage(m.viewList),
                        variant: 'text',
                        onClick: () => {
                          navigate(
                            replaceParams({
                              href: SignatureCollectionPaths.MunicipalList,
                              params: {
                                municipality: municipality,
                                listId: list.id,
                              },
                            }),
                          )
                        },
                      }}
                      tag={getTagConfig(list)}
                    />
                  ))}
                </Stack>
              </GridColumn>
            </GridRow>
          )}
          {municipalityLists.length > 0 && (
            <CompareLists
              collectionId={collection?.id}
              collectionType={collection?.collectionType}
              municipalAreaId={municipalityLists[0]?.collectionId}
            />
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Municipality
