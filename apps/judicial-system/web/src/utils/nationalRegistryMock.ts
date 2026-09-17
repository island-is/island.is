// Each real national registry lookup costs money, so outside production the
// api routes answer with fake records instead of calling the registry. Setting
// MOCK_NATIONAL_REGISTRY=true opts a production build into the same fakes,
// which is what the e2e tests rely on when run against a production build.
export const shouldMockNationalRegistry = () =>
  process.env.NODE_ENV !== 'production' ||
  process.env.MOCK_NATIONAL_REGISTRY === 'true'
