import getConfig from 'next/config'
import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import articleScreen from '@island.is/web/screens/Article'
import { withHealthchecks } from '@island.is/web/units/Healthchecks/withHealthchecks'

const { serverRuntimeConfig } = getConfig()
const { graphqlUrl } = serverRuntimeConfig
const externalEndpointDependencies = [graphqlUrl]

export default withHealthchecks(externalEndpointDependencies)(
  withApollo(withLocale('is')(articleScreen)),
)
