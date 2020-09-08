import getConfig from 'next/config'
import { withLocale } from '@island.is/adgerdir/i18n'
import articlePage from '@island.is/adgerdir/screens/Article'
import { withErrorBoundary } from '@island.is/adgerdir/units'
import { withHealthchecks } from '@island.is/adgerdir/units/Healthchecks/withHealthchecks'

const { serverRuntimeConfig } = getConfig()
const { graphqlEndpoint } = serverRuntimeConfig
const externalEndpointDependencies = [graphqlEndpoint]

export default withHealthchecks(externalEndpointDependencies)(withLocale('is')(withErrorBoundary(articlePage)))
