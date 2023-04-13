import { GridContainer, Text, Stack } from '@island.is/island-ui/core'
import Layout from '../../components/Layout/Layout'
import BreadcrumbsWithMobileDivider from '../../components/BreadcrumbsWithMobileDivider/BreadcrumbsWithMobileDivider'
import { useLogIn } from '../../utils/helpers'
import { SubscriptionActionCard } from '../../components/Card'

export const AdvicesLayout = ({ children }) => {
  return (
    <Layout seo={{ title: 'umsagnir', url: 'umsagnir' }}>
      <BreadcrumbsWithMobileDivider
        items={[
          { title: 'Samráðsgátt', href: '/' },
          { title: 'Mínar umsagnir' },
        ]}
      />
      <GridContainer>
        <Stack space={[3, 3, 3, 5, 5]}>
          <Stack space={3}>
            <Text variant="h1">Mínar umsagnir</Text>
            <Text variant="default">
              Hér er hægt að fylgjast með þeim áskriftum sem þú ert skráð(ur) í
              ásamt því að sjá allar umsagnir sem þú ert búin að skrifa í gegnum
              tíðina.
            </Text>
          </Stack>
          {children}
        </Stack>
      </GridContainer>
    </Layout>
  )
}

export const AdvicesScreen = ({ allUserAdvices, isNotAuthorized }) => {
  const LogIn = useLogIn()
  if (isNotAuthorized) {
    return (
      <AdvicesLayout>
        <SubscriptionActionCard
          heading="Mínar umsagnir"
          text="Þú verður að vera skráð(ur) inn til þess að geta séð þínar umsagnir."
          button={[{ label: 'Skrá mig inn', onClick: LogIn }]}
        />
      </AdvicesLayout>
    )
  }

  return <AdvicesLayout>{allUserAdvices}</AdvicesLayout>
}

export default AdvicesScreen
