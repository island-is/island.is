import { shouldLinkOpenInNewWindow } from './shouldLinkOpenInNewWindow'

describe('shouldLinkOpenInNewWindow', () => {
  it('should report https://island.is as not external', () => {
    const url = 'https://island.is'
    const external = shouldLinkOpenInNewWindow(url)
    expect(external).toBe(false)
  })

  it('should report https://island.is/ as not external', () => {
    const url = 'https://island.is/'
    const external = shouldLinkOpenInNewWindow(url)
    expect(external).toBe(false)
  })

  it('should report / as not external', () => {
    const url = '/'
    const external = shouldLinkOpenInNewWindow(url)
    expect(external).toBe(false)
  })

  it('should report https://island.is/path as not external', () => {
    const url = 'https://island.is/path'
    const external = shouldLinkOpenInNewWindow(url)
    expect(external).toBe(false)
  })

  it('should report https://subdomain.island.is as not external', () => {
    const url = 'https://subdomain.island.is'
    const external = shouldLinkOpenInNewWindow(url)
    expect(external).toBe(false)
  })

  it('should report https://subdomain.island.is/path as not external', () => {
    const url = 'https://subdomain.island.is/path'
    const external = shouldLinkOpenInNewWindow(url)
    expect(external).toBe(false)
  })

  it('should report /path as not external', () => {
    const url = '/path'
    const external = shouldLinkOpenInNewWindow(url)
    expect(external).toBe(false)
  })

  it('should report /path/subpath as not external', () => {
    const url = '/path/subpath'
    const external = shouldLinkOpenInNewWindow(url)
    expect(external).toBe(false)
  })

  it('should report https://example.com as external', () => {
    const url = 'https://example.com'
    const external = shouldLinkOpenInNewWindow(url)
    expect(external).toBe(true)
  })
  it('should report https://example.com/island.is as external', () => {
    const url = 'https://example.com/island.is'
    const external = shouldLinkOpenInNewWindow(url)
    expect(external).toBe(true)
  })

  it('should report https://example.com/island.is/ as external', () => {
    const url = 'https://example.com/island.is/'
    const external = shouldLinkOpenInNewWindow(url)
    expect(external).toBe(true)
  })

  it('should report https://example.com/https://island.is as external', () => {
    const url = 'https://example.com/https://island.is'
    const external = shouldLinkOpenInNewWindow(url)
    expect(external).toBe(true)
  })

  it('should report https://bisland.is as external', () => {
    const url = 'https://bisland.is'
    const external = shouldLinkOpenInNewWindow(url)
    expect(external).toBe(true)
  })

  it('should report http://island.is.example.com/ as external', () => {
    const url = 'https://island.is.example.com'
    const external = shouldLinkOpenInNewWindow(url)
    expect(external).toBe(true)
  })

  //TODO: remove this test once the function
  //      has been made parameterized.
  it('island.is, devland.is or localhost:nnnn should not matter', () => {
    const iurl = 'https://island.is/syslumenn'
    const durl = 'https://devland.is/syslumenn'
    const lurl = 'https://localhost:4200/syslumenn'

    const iexternal = shouldLinkOpenInNewWindow(iurl)
    const dexternal = shouldLinkOpenInNewWindow(durl)
    const lexternal = shouldLinkOpenInNewWindow(lurl)

    expect(iexternal || dexternal || lexternal).toBe(false)
  })
})
