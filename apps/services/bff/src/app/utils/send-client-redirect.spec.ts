import type { Response } from 'express'

import { sendClientRedirect } from './send-client-redirect'

const createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  }

  return res as unknown as Response & typeof res
}

describe('sendClientRedirect', () => {
  it('should send an HTML page that redirects to the url', () => {
    const res = createMockResponse()
    const url = 'https://island.is/minarsidur/postholf'

    sendClientRedirect(res, url)

    const html = res.send.mock.calls[0][0] as string

    expect(res.status).toHaveBeenCalledWith(200)
    expect(html).toContain(`location.replace("${url}")`)
    expect(html).toContain(`<meta http-equiv="refresh" content="0;url=${url}">`)
  })

  it('should allow the inline script and style with a nonce', () => {
    const res = createMockResponse()

    sendClientRedirect(res, 'https://island.is/minarsidur')

    const headers = res.set.mock.calls[0][0] as Record<string, string>
    const html = res.send.mock.calls[0][0] as string
    const nonce = headers['Content-Security-Policy'].match(
      /script-src 'nonce-([^']+)'/,
    )?.[1]

    expect(nonce).toBeDefined()
    expect(html).toContain(`<script nonce="${nonce}">`)
    expect(html).toContain(`<style nonce="${nonce}">`)
    expect(headers['Cache-Control']).toBe('no-store')
  })

  it('should escape the url in the meta tag and script', () => {
    const res = createMockResponse()
    const url = 'https://island.is/a?b=1&c="</script><script>alert(1)</script>'

    sendClientRedirect(res, url)

    const html = res.send.mock.calls[0][0] as string

    expect(html).not.toContain('</script><script>alert(1)')
    expect(html).toContain(
      'content="0;url=https://island.is/a?b=1&amp;c=&quot;&lt;/script&gt;',
    )
    expect(html).toContain('\\u003c/script>')
  })
})
