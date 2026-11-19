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

// `@nx/next` is mocked above to return the config object itself, whereas its
// real type is a config function.
type MockedNextConfig = {
  rewrites: () => Promise<{ afterFiles: unknown[] }>
}

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
    const nextConfig = (nextConfigModule.default ??
      nextConfigModule) as unknown as MockedNextConfig
    const rewrites = await nextConfig.rewrites()

    // `rewrites()` returns the phased `{ afterFiles }` shape (not a flat array)
    // so the BFF proxy can opt out of `basePath` via `basePath: false` — the
    // un-prefixed `/bff/*` the BFF client still calls. See next.config.js.
    expect(rewrites.afterFiles).toContainEqual({
      source: '/bff/:path*',
      destination: 'http://localhost:3010/bff/:path*',
      basePath: false,
    })
  })
})
