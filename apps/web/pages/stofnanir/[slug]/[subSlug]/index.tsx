import React from 'react'

import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '../../../../i18n/withLocale'
import { Screen } from '@island.is/web/types'
import { useRouter } from 'next/router'

// TODO: remove this redirect route after 9.1.0 is released
const StofnanirRedirect: Screen = () => {
  const router = useRouter()

  return (
    <div>
      <meta
        httpEquiv="refresh"
        content={`0;url=/s/${router.query.slug}/${router.query.subSlug}`}
      />
    </div>
  )
}

StofnanirRedirect.getInitialProps = async ({ res, query }) => {
  if (res) {
    res.writeHead(302, {
      Location: `/s/${query.slug}/${query.subSlug}`,
    })
    res.end()
  }
}

export default withApollo(withLocale('is')(StofnanirRedirect))
