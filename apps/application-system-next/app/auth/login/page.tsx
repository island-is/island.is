import { BffLoginRedirect } from '../../../components/BffLoginRedirect'

export default function AuthLoginPage({
  searchParams,
}: {
  searchParams: { target_link_uri?: string }
}) {
  return (
    <BffLoginRedirect targetLinkUri={searchParams.target_link_uri ?? '/'} />
  )
}
