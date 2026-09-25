// Each real national registry lookup costs money, so in development and test
// the api routes answer with fake records instead of calling the registry.
// Setting MOCK_NATIONAL_REGISTRY=true opts a production build into the same
// fakes, which is what the e2e tests rely on when run against a production
// build. Anything else - including an unset or misspelled NODE_ENV - calls the
// real registry, so a misconfigured production process never serves fakes.
export const shouldMockNationalRegistry = () => {
  const nodeEnv = process.env.NODE_ENV

  if (nodeEnv === 'development' || nodeEnv === 'test') {
    return true
  }

  return (
    nodeEnv === 'production' && process.env.MOCK_NATIONAL_REGISTRY === 'true'
  )
}
