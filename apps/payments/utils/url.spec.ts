import { isHttpsUrl } from './url'

describe('isHttpsUrl', () => {
  it.each(['https://blikk.tech/sca', 'https://example.com/path?q=1'])(
    'accepts https URL %s',
    (url) => {
      expect(isHttpsUrl(url)).toBe(true)
    },
  )

  it.each([
    'http://blikk.tech/sca',
     
    'javascript:alert(1)',
    'data:text/html,evil',
    'ftp://example.com',
    '/relative/path',
    'not a url',
    '',
    undefined,
    null,
  ])('rejects non-https value %s', (url) => {
    expect(isHttpsUrl(url as string | undefined | null)).toBe(false)
  })
})
