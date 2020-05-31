import { Router } from 'express'
import { body, cookie, query, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { Entropy } from 'entropy-string'
import IslandisLogin from 'islandis-login'
import { uuid } from 'uuidv4'

import { Credentials } from '../../types'
import { VerifyResult } from './types'
import {
  REDIRECT_COOKIE,
  ACCESS_TOKEN_COOKIE,
  CSRF_COOKIE,
  JWT_EXPIRES_IN_SECONDS,
} from './consts'
import { environment } from '../../environments'

const router = Router()

const { samlEntryPoint, audience: audienceUrl, jwtSecret } = environment.auth
const loginIS = new IslandisLogin({
  audienceUrl,
})

router.post(
  '/callback',
  [body('token').notEmpty(), cookie(REDIRECT_COOKIE.name).notEmpty()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() })
    }

    const { token } = req.body
    const { authId, returnUrl } = req.cookies[REDIRECT_COOKIE.name]
    res.clearCookie(REDIRECT_COOKIE.name, REDIRECT_COOKIE.options)
    let verifyResult: VerifyResult

    try {
      verifyResult = await loginIS.verify(token)
    } catch (err) {
      console.error(err)
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { user } = verifyResult
    if (!user || authId !== user?.authId || returnUrl.charAt(0) !== '/') {
      return res.status(401).json({ error: 'Invalid auth state' })
    }

    const csrfToken = new Entropy({ bits: 128 }).string()
    const jwtToken = jwt.sign(
      {
        user: { ssn: user.kennitala, name: user.fullname },
        csrfToken,
      } as Credentials,
      jwtSecret, //TODO: Use cert to sign jwt
      { expiresIn: JWT_EXPIRES_IN_SECONDS },
    )

    const tokenParts = jwtToken.split('.')
    if (tokenParts.length !== 3) {
      return res.status(401).json({ error: 'Invalid auth state' })
    }

    const maxAge = JWT_EXPIRES_IN_SECONDS * 1000
    return res
      .cookie(CSRF_COOKIE.name, csrfToken, {
        ...CSRF_COOKIE.options,
        maxAge,
      })
      .cookie(ACCESS_TOKEN_COOKIE.name, jwtToken, {
        ...ACCESS_TOKEN_COOKIE.options,
        maxAge,
      })
      .redirect(returnUrl)
  },
)

router.get(
  '/login',
  [
    query('returnUrl')
      .optional()
      .isString()
      .customSanitizer((value) => {
        if (!value || String(value).charAt(0) !== '/') {
          return '/'
        }
        return value
      }),
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() })
    }

    const { name, options } = REDIRECT_COOKIE
    res.clearCookie(name, options)
    const authId = uuid()
    const { returnUrl } = req.query

    res
      .cookie(
        name,
        { authId, returnUrl },
        { ...options, maxAge: 15 * 60 * 1000 },
      )
      .redirect(`${samlEntryPoint}&authid=${authId}`)
  },
)

router.get('/logout', (req, res) => {
  res.clearCookie(ACCESS_TOKEN_COOKIE.name, ACCESS_TOKEN_COOKIE.options)
  res.clearCookie(CSRF_COOKIE.name, CSRF_COOKIE.options)
  res.json({ logout: true })
})

export default router
