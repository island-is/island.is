import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import landingScreen from '../../screens/LandingPage/LandingPage'
import getConfig from 'next/config'
import { withHealthchecks } from '../../units/Healthchecks/withHealthchecks'

const { serverRuntimeConfig } = getConfig()
const { graphqlUrl } = serverRuntimeConfig
const externalEndpointDependencies = [graphqlUrl]

export default withHealthchecks(externalEndpointDependencies)(
  withApollo(withLocale('is')(landingScreen)),
)
