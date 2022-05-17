import '@island.is/api/mocks'

import getConfig from 'next/config'

import { withHealthchecks } from '@island.is/next/health'

import withApollo from '../../graphql/withApollo'
import { withLocale } from '../../i18n'
import articleScreen from '../../screens/Article'

const { serverRuntimeConfig } = getConfig()
const { graphqlUrl } = serverRuntimeConfig
const externalEndpointDependencies = [graphqlUrl]

export default withHealthchecks(externalEndpointDependencies)(
  withApollo(withLocale('is')(articleScreen)),
)
