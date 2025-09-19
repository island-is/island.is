import {
  ActionCard,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  Stack,
  Pagination,
  Breadcrumbs,
  Divider,
  AlertMessage,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  CollectionStatus,
  SignatureCollectionCandidate,
} from '@island.is/api/schema'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { pageSize } from '../../lib/utils'
import EmptyState from '../../shared-components/emptyState'
import CompareLists from '../../shared-components/compareLists'
import { ListsLoaderReturn } from '../../loaders/AllLists.loader'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import ActionDrawer from '../../shared-components/actionDrawer'
import { Actions } from '../../shared-components/actionDrawer/ListActions'
import FindSignature from '../../shared-components/findSignature'
import { SignatureCollectionPaths } from '../../lib/paths'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'

const AllCandidates = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { collection, collectionStatus } = useLoaderData() as ListsLoaderReturn

  const uniqueCandidates = Array.from(
    new Map(
      collection.candidates.map((candidate) => [candidate.id, candidate]),
    ).values(),
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
                  title: formatMessage(m.signatureListsTitlePresidential),
                },
              ]}
            />
          </Box>
          <IntroHeader
            title={formatMessage(m.signatureListsTitlePresidential)}
            intro={formatMessage(m.signatureListsIntro)}
            img={nationalRegistryLogo}
            imgPosition="right"
            imgHiddenBelow="sm"
            buttonGroup={
              <ActionDrawer
                allowedActions={[
                  Actions.CreateCollection,
                  Actions.ReviewCandidates,
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
                title={formatMessage(m.collectionPresidentialReviewedTitle)}
                message={formatMessage(m.collectionPresidentialReviewedMessage)}
              />
            </Box>
          )}
          <Divider />
          <Box marginTop={9} />
          {uniqueCandidates?.length > 0 ? (
            <Box>
              <FindSignature collectionId={collection.id} />
              <Box marginBottom={2} display="flex" justifyContent="flexEnd">
                {uniqueCandidates.length > 0 && (
                  <Text variant="eyebrow">
                    {formatMessage(m.totalCandidates)}:{' '}
                    {uniqueCandidates.length}
                  </Text>
                )}
              </Box>
              <Stack space={3}>
                {uniqueCandidates
                  .slice(pageSize * (page - 1), pageSize * page)
                  .map((candidate: SignatureCollectionCandidate) => {
                    const birthDateFormatted = (() => {
                      const date = new Date(candidate.ownerBirthDate)
                      return isValid(date)
                        ? format(date, 'dd.MM.yyyy')
                        : 'Óþekkt'
                    })()
                    return (
                      <ActionCard
                        key={candidate.name}
                        eyebrow={`${formatMessage(
                          m.candidateBirthDate,
                        )} ${birthDateFormatted}`}
                        heading={candidate.name}
                        cta={{
                          label: formatMessage(m.viewList),
                          variant: 'text',
                          icon: 'arrowForward',
                          onClick: () => {
                            navigate(
                              SignatureCollectionPaths.PresidentialCandidateLists.replace(
                                ':candidateId',
                                candidate.id,
                              ),
                            )
                          },
                        }}
                      />
                    )
                  })}
              </Stack>
              {uniqueCandidates.length > pageSize && (
                <Box marginTop={5}>
                  <Pagination
                    totalItems={uniqueCandidates.length}
                    itemsPerPage={pageSize}
                    page={page}
                    renderLink={(page, className, children) => (
                      <Box
                        cursor="pointer"
                        className={className}
                        onClick={() => setPage(page)}
                        component="button"
                      >
                        {children}
                      </Box>
                    )}
                  />
                </Box>
              )}
              <CompareLists
                collectionId={collection?.id}
                collectionType={collection?.collectionType}
              />
            </Box>
          ) : (
            <EmptyState
              title={formatMessage(m.noLists)}
              description={formatMessage(m.noListsDescription)}
            />
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default AllCandidates
