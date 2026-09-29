import { useState } from 'react'
import { defineMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-use'

import {
  Box,
  Button,
  GridColumn,
  Input,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import {
  FaqList,
  FaqListProps,
  renderHtml,
} from '@island.is/island-ui/contentful'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  useGetServicePortalPageQuery,
} from '@island.is/portals/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { isCompany } from '@island.is/shared/utils'
import { AuthDelegationRequestStatus } from '@island.is/api/schema'

import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'
import { IncomingRequests } from '../../components/delegationRequests/IncomingRequests'
import { OutgoingRequests } from '../../components/delegationRequests/OutgoingRequests'
import {
  useAuthDelegationRequestsIncomingQuery,
  useAuthDelegationRequestsOutgoingQuery,
} from '../../components/delegationRequests/DelegationRequests.generated'
import * as styles from '../../components/delegationRequests/DelegationRequests.css'

const DelegationRequests = () => {
  useNamespaces('sp.access-control-delegations')
  const { formatMessage, lang = 'is' } = useLocale()
  const navigate = useNavigate()
  const location = useLocation()
  const userInfo = useUserInfo()
  const [search, setSearch] = useState('')

  const { data: contentfulQueryData } = useGetServicePortalPageQuery({
    variables: { input: { slug: 'umbodsbeidnir', lang } },
  })
  const contentfulData = contentfulQueryData?.getServicePortalPage
  const faqList =
    (isCompany(userInfo) && contentfulData?.faqListCompany) ||
    contentfulData?.faqList

  const {
    data: incomingData,
    loading: incomingLoading,
  } = useAuthDelegationRequestsIncomingQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })
  const {
    data: outgoingData,
    loading: outgoingLoading,
  } = useAuthDelegationRequestsOutgoingQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  const canRequest = !isCompany(userInfo)
  const loading = incomingLoading || outgoingLoading
  const hasAllData = Boolean(incomingData) && Boolean(outgoingData)
  const visibleIncoming = (
    incomingData?.authDelegationRequestsIncoming ?? []
  ).filter((r) => r.status !== AuthDelegationRequestStatus.cancelled)
  const outgoing = outgoingData?.authDelegationRequestsOutgoing ?? []
  const isEmpty = visibleIncoming.length === 0 && outgoing.length === 0
  const showSearch = !isEmpty

  return (
    <>
      <IntroHeader
        title={formatMessage(m.delegationRequestsPageTitle)}
        intro={defineMessage(m.delegationRequestsPageIntro)}
        marginBottom={[2, 2, 4]}
      >
        <GridColumn span={['8/8', '3/8']}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems={['flexStart', 'flexEnd']}
            rowGap={2}
            paddingTop={[3, 6]}
          >
            {canRequest && (
              <Button
                icon="personAdd"
                iconType="outline"
                size="small"
                onClick={() =>
                  navigate(
                    `${DelegationPaths.DelegationRequest}${
                      location?.search ?? ''
                    }`,
                  )
                }
              >
                {formatMessage(m.requestDelegationNavTitle)}
              </Button>
            )}
            {showSearch && (
              <div className={styles.searchWrapper}>
                <Input
                  name="search-requests"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={formatMessage(m.searchAllRequestsPlaceholder)}
                  size="xs"
                  type="text"
                  backgroundColor="blue"
                  icon={{ name: 'search' }}
                />
              </div>
            )}
          </Box>
        </GridColumn>
      </IntroHeader>

      {loading && !hasAllData ? (
        <Box paddingTop={2}>
          <SkeletonLoader space={1} height={40} repeat={3} />
        </Box>
      ) : isEmpty ? (
        <Box paddingTop={2}>
          <div className={styles.problemContainer}>
            <Problem
              type="no_data"
              title={formatMessage(m.noRequestsFound)}
              titleSize="h4"
              size="large"
              imgSrc="./assets/images/jobsGrid.svg"
              imgClassName={styles.problemImg}
              message={
                contentfulData?.emptyStateMessage?.document
                  ? renderHtml(contentfulData.emptyStateMessage.document)
                  : formatMessage(m.noRequestsFoundMessage)
              }
            />
          </div>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column">
          <IncomingRequests search={search} />
          <OutgoingRequests search={search} />
        </Box>
      )}

      {faqList && faqList.questions.length > 0 && (
        <Box paddingTop={8}>
          <FaqList {...((faqList as unknown) as FaqListProps)} />
        </Box>
      )}
    </>
  )
}

export default DelegationRequests
