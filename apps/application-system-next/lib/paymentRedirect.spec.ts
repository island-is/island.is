import {
  getPaymentRedirectStatus,
  removeCancelledParam,
} from './paymentRedirect'
import { buildScreenUrl } from './screenNavigation'

const BASE = 'https://island.is/umsoknir/sdf/slug/id'

// The query string of the address bar after the client has added the screen id.
const searchAfterScreenRewrite = (href: string) =>
  new URL(buildScreenUrl(href, 'pay'), href).search

describe('getPaymentRedirectStatus', () => {
  it('reads the bare return params the gateway sends', () => {
    expect(getPaymentRedirectStatus('?done')).toBe('done')
    expect(getPaymentRedirectStatus('?cancelled')).toBe('cancelled')
  })

  it('reads them after the screen id has been added to the address bar', () => {
    expect(
      getPaymentRedirectStatus(searchAfterScreenRewrite(`${BASE}?done`)),
    ).toBe('done')
    expect(
      getPaymentRedirectStatus(searchAfterScreenRewrite(`${BASE}?cancelled`)),
    ).toBe('cancelled')
  })

  it('returns undefined when the user did not come back from the gateway', () => {
    expect(getPaymentRedirectStatus('')).toBeUndefined()
    expect(getPaymentRedirectStatus('?screen=pay')).toBeUndefined()
    expect(getPaymentRedirectStatus('?invoice')).toBeUndefined()
  })
})

describe('removeCancelledParam', () => {
  it('removes the bare param', () => {
    expect(removeCancelledParam('https://island.is/a/b?cancelled')).toBe('/a/b')
  })

  it('removes it after the screen id was added, keeping the screen id', () => {
    expect(
      removeCancelledParam('https://island.is/a/b?cancelled=&screen=pay'),
    ).toBe('/a/b?screen=pay')
  })

  it('leaves other params and the hash alone', () => {
    expect(
      removeCancelledParam('https://island.is/a/b?x=1&cancelled#top'),
    ).toBe('/a/b?x=1#top')
  })
})
