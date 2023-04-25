import {
  ArrowLink,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import Layout from '../../components/Layout/Layout'

export const EmailVerifiedPage = () => {
  return (
    <Layout seo={{ title: 'Netfang staðfest', url: '/user/email-verified' }}>
      <GridContainer>
        <GridRow>
          <GridColumn span={'12/12'} paddingBottom={10} paddingTop={8}>
            <Box
              display="flex"
              flexDirection="column"
              width="full"
              alignItems="center"
            >
              <Text
                variant="eyebrow"
                as="div"
                paddingBottom={2}
                color="purple400"
              >
                Aðgerð tókst
              </Text>

              <Text variant="h1" as="h1" paddingBottom={3}>
                Netfang staðfest
              </Text>
              <Text paddingBottom={3}>
                Nú geturu skráð þig í áskrift á hinum ýmsum málum
              </Text>
              <ArrowLink href="/">Aftur á forsíðu</ArrowLink>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}
export default EmailVerifiedPage
