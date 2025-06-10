import { GetServerSideProps } from 'next'
import getConfig from 'next/config'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const { serverRuntimeConfig } = getConfig()
  const baseUrl = serverRuntimeConfig.appExternalUrl

  res.setHeader('Content-Type', 'application/json')

  const config = {
    issuer: baseUrl,
    jwks_uri: `${baseUrl}/.well-known/jwks.json`,
    id_token_signing_alg_values_supported: ['RS256'],
    claims_supported: ['kty', 'n', 'e', 'kid', 'use', 'alg'],
  }

  res.write(JSON.stringify(config))
  res.end()

  return {
    props: {},
  }
}

export default function OpenIdConfigurationPage() {
  return null
}
