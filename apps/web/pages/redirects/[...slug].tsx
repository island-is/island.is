import type { GetServerSideProps } from 'next'

import initApollo from '@island.is/web/graphql/client'
import { fetch404RedirectUrl } from '@island.is/web/utils/fetch404RedirectUrl'
import { resolveLegacyRedirect } from '@island.is/web/utils/legacyRedirects'

/**
 * Old websites redirect to island.is/redirects/<host>/<path>.
 * Urls with a custom handler (see utils/legacyRedirects) are redirected by it,
 * other urls fall through to the CMS redirects.
 */
const LegacyRedirect = () => null

export default LegacyRedirect

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug, ...query } = ctx.query
  const redirect = await resolveLegacyRedirect(
    Array.isArray(slug) ? slug : [],
    query,
  )
  if (redirect) {
    return { redirect }
  }

  const apolloClient = initApollo({}, 'is', ctx)
  const redirectUrl = await fetch404RedirectUrl(
    apolloClient,
    ctx.resolvedUrl,
    'is',
  )
  if (redirectUrl) {
    return { redirect: { destination: redirectUrl, permanent: false } }
  }

  return { notFound: true }
}
