import { headers } from 'next/headers'
import { BffLoginRedirect } from '../../../components/BffLoginRedirect'
import { buildApplicationSystemRootUrl } from '../../../lib/authRedirect'

export default async function AuthLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ target_link_uri?: string }>
}) {
  const { target_link_uri: targetLinkUri } = await searchParams

  // Without a target, sign in back to the application system's root, as the
  // legacy form does.
  const requestHeaders = await headers()
  const fallbackTarget = buildApplicationSystemRootUrl({
    host: requestHeaders.get('host') ?? undefined,
    protocol: requestHeaders.get('x-forwarded-proto') ?? undefined,
  })

  return <BffLoginRedirect targetLinkUri={targetLinkUri ?? fallbackTarget} />
}
