import '@island.is/api/mocks'

import getConfig from 'next/config'
import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import ArticleScreen from '@island.is/web/screens/Article'
import { withHealthchecks } from '@island.is/web/units/Healthchecks/withHealthchecks'
import OrganizationSubpage from '@island.is/web/screens/Organization/SubPage'
import React from 'react'
import { ORGANIZATION_SLUGS } from '@island.is/web/constants'

const { serverRuntimeConfig } = getConfig()
const { graphqlUrl } = serverRuntimeConfig
const externalEndpointDependencies = [graphqlUrl]

const rootScreen = () => {
  const NewComponent = (props) => {
    return ORGANIZATION_SLUGS.includes(props.slug) ? (
      <OrganizationSubpage {...props} />
    ) : (
      <ArticleScreen {...props} />
    )
  }

  NewComponent.getInitialProps = async (ctx) => {
    const getInitialProps = ORGANIZATION_SLUGS.includes(ctx.query.slug)
      ? OrganizationSubpage.getInitialProps
      : ArticleScreen.getInitialProps
    return {
      slug: ctx.query.slug,
      ...(await getInitialProps(ctx)),
    }
  }

  return NewComponent
}

export default withHealthchecks(externalEndpointDependencies)(
  withApollo(withLocale('is')(rootScreen())),
)
