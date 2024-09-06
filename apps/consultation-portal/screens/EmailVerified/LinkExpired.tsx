import {
  ArrowLink,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { Layout } from '../../components'
import localization from './EmailVerified.json'

export const LinkExpiredScreen = () => {
  const loc = localization['linkExpired']
  return (
    <Layout seo={{ title: loc.seo.title, url: loc.seo.url }}>
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
                {loc.failText}
              </Text>

              <Text variant="h1" as="h1" paddingBottom={3}>
                {loc.linkExpiredText}
              </Text>
              <Text paddingBottom={3}>{loc.text}</Text>
              <ArrowLink href="/">{loc.arrowLinkText}</ArrowLink>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}
export default LinkExpiredScreen
