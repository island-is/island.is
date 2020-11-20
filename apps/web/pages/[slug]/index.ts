import '@island.is/api/mocks'
import getConfig from 'next/config'
import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import articleScreen from '@island.is/web/screens/Article'
import { withHealthchecks } from '@island.is/web/units/Healthchecks/withHealthchecks'
import { withContentfulEditor } from '@island.is/contentful-editor'

import { environment } from '../../environments/environment'

const { serverRuntimeConfig } = getConfig()
const { graphqlUrl } = serverRuntimeConfig
const externalEndpointDependencies = [graphqlUrl]

export default withHealthchecks(externalEndpointDependencies)(
  withContentfulEditor(withApollo(withLocale('is')(articleScreen)), environment.contentful),
)
