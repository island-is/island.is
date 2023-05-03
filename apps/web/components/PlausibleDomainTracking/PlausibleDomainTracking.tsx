import { PLAUSIBLE_SCRIPT_SRC } from '@island.is/web/constants'

interface PlausibleDomainTrackingProps {
  domain?: string
}

export const PlausibleDomainTracking = ({
  domain,
}: PlausibleDomainTrackingProps) => {
  if (!domain) return null
  return <script defer data-domain={domain} src={PLAUSIBLE_SCRIPT_SRC}></script>
}
