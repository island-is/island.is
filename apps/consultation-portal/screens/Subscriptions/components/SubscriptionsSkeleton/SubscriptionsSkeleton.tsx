import {
  Box,
  Divider,
  GridContainer,
  LoadingDots,
  Stack,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import { Breadcrumbs, Layout } from '../../../../components'
import { ReactNode } from 'react'
import EmailBox from '../EmailBox/EmailBox'
import { Area } from '../../../../types/enums'
import Link from 'next/link'
import { useUser } from '../../../../hooks/useUser'
import localization from '../../Subscriptions.json'
import { useFetchEmail, useIsMobile } from '../../../../hooks'

interface Props {
  children: ReactNode
  isMySubscriptions?: boolean
  currentTab: Area
  setCurrentTab: (value: Area) => void
  tabs: any
  getUserSubsLoading?: boolean
}

const loc = localization['subscriptionSkeleton']
const locSubs = loc['subscriptions']
const locMySubs = loc['mySubscriptions']

const BREADCRUMBS_LIST = [
  { title: loc.breadcrumbs[0].title, href: loc.breadcrumbs[0].href },
  {
    title: loc.breadcrumbs[1].title,
    href: loc.breadcrumbs[1].href,
  },
]

const MY_BREADCRUMBS_LIST = [
  ...BREADCRUMBS_LIST,
  { title: loc.myBreadcrumbs[0].title, href: loc.myBreadcrumbs[0].href },
]

const SUBSCRIPTIONS = {
  title: locSubs.title,
  url: locSubs.url,
  description: locSubs.description,
  keywords: locSubs.keywords,
}

const MY_SUBSCRIPTIONS = {
  title: locMySubs.title,
  url: locMySubs.url,
  description: locMySubs.description,
}

const SubscriptionsSkeleton = ({
  children,
  isMySubscriptions,
  currentTab,
  setCurrentTab,
  tabs,
  getUserSubsLoading,
}: Props) => {
  const { isAuthenticated, userLoading } = useUser()
  const { isMobile } = useIsMobile()
  const { email, emailVerified, getUserEmailLoading } = useFetchEmail({
    isAuthenticated,
    isMySubscriptions,
  })

  return (
    <Layout
      seo={isMySubscriptions ? MY_SUBSCRIPTIONS : SUBSCRIPTIONS}
      justifyContent={
        isAuthenticated && isMobile ? 'flexStart' : 'spaceBetween'
      }
    >
      <Divider />
      <Box background="blue100">
        <Breadcrumbs
          items={isMySubscriptions ? MY_BREADCRUMBS_LIST : BREADCRUMBS_LIST}
        />

        <GridContainer>
          <Box paddingBottom={[3, 3, 3, 5, 5]}>
            <Stack space={[3, 3, 3, 5, 5]}>
              <Stack space={3}>
                <Text
                  variant="h1"
                  color="dark400"
                  dataTestId="subscriptions-title"
                >
                  {isMySubscriptions ? locMySubs.title : locSubs.title}
                </Text>
                <Stack space={1}>
                  <Text variant="default">
                    {isMySubscriptions ? locMySubs.text : locSubs.text}
                  </Text>
                  {!isMySubscriptions && (
                    <Link href={loc.unsubscribeLink.href}>
                      {loc.unsubscribeLink.text}
                    </Link>
                  )}
                </Stack>
              </Stack>
              {!isMySubscriptions && (
                <EmailBox
                  email={email}
                  emailVerified={emailVerified}
                  getUserEmailLoading={getUserEmailLoading}
                />
              )}
            </Stack>
            {children}
          </Box>
        </GridContainer>
      </Box>
      <Divider />
      {isAuthenticated && !userLoading && emailVerified && (
        <GridContainer>
          <Box paddingTop={[3, 3, 3, 5, 5]}>
            {isMySubscriptions && getUserSubsLoading ? (
              <>
                <LoadingDots />
              </>
            ) : (
              <Tabs
                selected={currentTab}
                onlyRenderSelectedTab={true}
                label={loc.tabsLabel}
                tabs={tabs}
                contentBackground="transparent"
                onChange={(e: Area) => setCurrentTab(e)}
              />
            )}
          </Box>
        </GridContainer>
      )}
    </Layout>
  )
}

export default SubscriptionsSkeleton
