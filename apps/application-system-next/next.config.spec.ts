jest.mock('@nx/next', () => ({
  composePlugins:
    (
      ...plugins: Array<
        (config: Record<string, unknown>) => Record<string, unknown>
      >
    ) =>
    (config: Record<string, unknown>) =>
      plugins.reduce((acc, plugin) => plugin(acc), config),
  withNx: (config: Record<string, unknown>) => config,
}))

jest.mock('@vanilla-extract/next-plugin', () => ({
  createVanillaExtractPlugin: () => (config: Record<string, unknown>) => config,
}))

describe('application-system-next next config', () => {
  const originalEnv = process.env

  afterEach(() => {
    process.env = originalEnv
    jest.resetModules()
  })

  it('proxies bff requests to the local bff service by default', async () => {
    process.env = { ...originalEnv }
    delete process.env.BFF_PROXY_TARGET

    const nextConfigModule = await import('./next.config.js')
    const nextConfig = nextConfigModule.default ?? nextConfigModule
    const rewrites = await nextConfig.rewrites()

    expect(rewrites).toContainEqual({
      source: '/bff/:path*',
      destination: 'http://localhost:3010/bff/:path*',
    })
  })
})
