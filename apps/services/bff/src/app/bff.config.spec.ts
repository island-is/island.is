import { BffConfigSchema } from './bff.config'

describe('BffConfigSchema.proxyMaxSockets', () => {
  const proxyMaxSockets = BffConfigSchema.shape.proxyMaxSockets

  it.each([0, -1, 1.5])('rejects %p', (value) => {
    expect(proxyMaxSockets.safeParse(value).success).toBe(false)
  })

  it.each([1, 50, 1000])('accepts positive integer %p', (value) => {
    expect(proxyMaxSockets.safeParse(value).success).toBe(true)
  })
})
