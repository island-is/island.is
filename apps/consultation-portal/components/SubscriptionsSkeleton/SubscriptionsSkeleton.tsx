import {
  Box,
  Divider,
  GridContainer,
  LoadingDots,
  Stack,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import Layout from '../Layout/Layout'
import { BreadcrumbsWithMobileDivider } from '../BreadcrumbsWithMobileDivider'
import { ReactNode } from 'react'
import EmailBox from '../EmailBox/EmailBox'
import { Area } from '../../types/enums'

interface Props {
  children: ReactNode
  isMySubscriptions?: boolean
  currentTab: Area
  setCurrentTab: (value: Area) => void
  tabs: any
  getUserSubsLoading?: boolean
}

const BREADCRUMBS_LIST = [
  { title: 'Samráðsgátt', href: '/samradsgatt' },
  {
    title: 'Áskriftir ',
    href: '/samradsgatt/askriftir',
  },
]

const MY_BREADCRUMBS_LIST = [
  ...BREADCRUMBS_LIST,
  { title: 'Mínar áskriftir ', href: '/samradsgatt/minaraskriftir' },
]

const SUBSCRIPTIONS = {
  title: 'Áskriftir',
  url: 'askriftir',
}

const MY_SUBSCRIPTIONS = {
  title: 'Mínar áskriftir',
  url: 'minaraskriftir',
}

const SubscriptionsSkeleton = ({
  children,
  isMySubscriptions,
  currentTab,
  setCurrentTab,
  tabs,
  getUserSubsLoading,
}: Props) => {
  return (
    <Layout
      seo={isMySubscriptions ? MY_SUBSCRIPTIONS : SUBSCRIPTIONS}
      justifyContent="flexStart"
    >
      <Divider />
      <Box background="blue100">
        <BreadcrumbsWithMobileDivider
          items={isMySubscriptions ? MY_BREADCRUMBS_LIST : BREADCRUMBS_LIST}
        />

        <GridContainer>
          <Box paddingX={[0, 0, 0, 8, 15]} paddingBottom={3}>
            <Stack space={[3, 3, 3, 5, 5]}>
              <Stack space={3}>
                <Text variant="h1" color="dark400">
                  {isMySubscriptions ? 'Mínar áskriftir' : 'Áskriftir'}
                </Text>
                <Stack space={1}>
                  <Text variant="default">
                    {isMySubscriptions
                      ? 'Hér er hægt að halda utan um áskriftir og skrá sig úr áskriftum. Aðeins birtast virk mál. Kerfið er uppfært einu sinni á sólarhring.'
                      : 'Hér er hægt að skrá sig í áskrift að málum. Þú skráir þig inn á Ísland.is, hakar við einn eða fleiri flokka (mál/stofnanir/málefnasvið), velur hvort þú vilt tilkynningar um ný mál eða fleiri atriði og smellir á „Staðfesta“. Loks þarftu að staðfesta áskriftina í gegnum netfangið sem þú skráðir. Kerfið er uppfært einu sinni á sólarhring.'}
                  </Text>
                </Stack>
              </Stack>
              {isMySubscriptions ? <></> : <EmailBox />}
            </Stack>
            {children}
          </Box>
        </GridContainer>
      </Box>
      <Divider />
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
              label="Veldu tegund áskrifta"
              tabs={tabs}
              contentBackground="transparent"
              onChange={(e: Area) => setCurrentTab(e)}
            />
          )}
        </Box>
      </GridContainer>
    </Layout>
  )
}

export default SubscriptionsSkeleton
