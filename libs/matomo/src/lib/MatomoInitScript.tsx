interface MatomoInitScriptProps {
  matomoDomain: string
}

/**
 * Server-rendered script tag that loads matomo.js.
 * Use in _document.tsx <Head> to ensure the script is in the initial HTML.
 */
export const MatomoInitScript = ({ matomoDomain }: MatomoInitScriptProps) => {
  if (!matomoDomain) {
    return null
  }

  const normalizedDomain = matomoDomain.endsWith('/')
    ? matomoDomain
    : `${matomoDomain}/`

  return <script async src={`${normalizedDomain}matomo.js`}></script>
}
