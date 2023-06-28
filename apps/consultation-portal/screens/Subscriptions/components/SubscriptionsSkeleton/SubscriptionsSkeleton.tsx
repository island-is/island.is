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

interface Props {
  children: ReactNode
  isMySubscriptions?: boolean
  currentTab: Area
  setCurrentTab: (value: Area) => void
  tabs: any
  getUserSubsLoading?: boolean
}

const loc = localization['subscriptionSkeleton']

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
  title: loc.subscriptions.title,
  url: loc.subscriptions.url,
}

const MY_SUBSCRIPTIONS = {
  title: loc.mySubscriptions.title,
  url: loc.mySubscriptions.url,
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

  return (
    <Layout
      seo={isMySubscriptions ? MY_SUBSCRIPTIONS : SUBSCRIPTIONS}
      justifyContent={isAuthenticated ? 'flexStart' : 'spaceBetween'}
    >
      <Divider />
      <Box background="blue100">
        <Breadcrumbs
          items={isMySubscriptions ? MY_BREADCRUMBS_LIST : BREADCRUMBS_LIST}
        />

        <GridContainer>
          <Box paddingX={[0, 0, 0, 8, 15]} paddingBottom={3}>
            <Stack space={[3, 3, 3, 5, 5]}>
              <Stack space={3}>
                <Text variant="h1" color="dark400">
                  {isMySubscriptions
                    ? loc.mySubscriptions.title
                    : loc.subscriptions.title}
                </Text>
                <Stack space={1}>
                  <Text variant="default">
                    {isMySubscriptions
                      ? loc.mySubscriptions.text
                      : loc.subscriptions.text}
                  </Text>
                  {!isMySubscriptions && (
                    <Link href={loc.unsubscribeLink.href}>
                      <a>{loc.unsubscribeLink.text}</a>
                    </Link>
                  )}
                </Stack>
              </Stack>
              {!isMySubscriptions && <EmailBox />}
            </Stack>
            {children}
          </Box>
        </GridContainer>
      </Box>
      <Divider />
      {isAuthenticated && !userLoading && (
        <GridContainer>
          <Box paddingX={[0, 0, 0, 8, 15]} paddingTop={[3, 3, 3, 5, 5]}>
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
