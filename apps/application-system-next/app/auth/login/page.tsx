import { BffLoginRedirect } from '../../../components/BffLoginRedirect'

export default async function AuthLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ target_link_uri?: string }>
}) {
  const { target_link_uri: targetLinkUri } = await searchParams

  return <BffLoginRedirect targetLinkUri={targetLinkUri ?? '/'} />
}
