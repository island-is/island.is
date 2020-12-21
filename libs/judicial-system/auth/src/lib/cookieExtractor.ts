import { Request } from 'express'

import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/judicial-system/consts'

export const cookieExtractor = (req: Request) => {
  if (req && req.cookies) {
    return req.cookies[ACCESS_TOKEN_COOKIE_NAME]
  }

  if (req && req.headers['cookie']) {
    const cookie: string = req.headers['cookie'] as string
    const match = cookie.match(
      new RegExp(
        '(?:^|;)\\s?' + ACCESS_TOKEN_COOKIE_NAME + '=(.*?)(?:;|$)',
        'i',
      ),
    )

    return match && unescape(match[1])
  }

  return undefined
}
