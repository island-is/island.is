import { Router, CookieOptions } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { Entropy } from 'entropy-string'
import IslandisLogin from 'islandis-login'
import { uuid } from 'uuidv4'

import { VerifyResult } from './types'
import { REDIRECT_COOKIE, PAYLOAD_COOKIE, SIGNATURE_COOKIE } from './consts'
import { environment } from '../../../environments/environment'

const router = Router()

const { samlEntryPoint, audience: audienceUrl, jwtSecret } = environment.auth
const loginIS = new IslandisLogin({
  audienceUrl,
})

router.post('/callback', async (req, res) => {
  const { token } = req.body
  const { authId, returnUrl } = req.cookies[REDIRECT_COOKIE.name] || {}
  res.clearCookie(REDIRECT_COOKIE.name, REDIRECT_COOKIE.options)
  let verifyResult: VerifyResult

  try {
    verifyResult = await loginIS.verify(token)
  } catch (err) {
    console.error(err)
    return res.redirect('/auth/error')
  }

  const { user } = verifyResult
  if (!user || authId !== user?.authId || returnUrl.charAt(0) !== '/') {
    return res.redirect('/auth/error')
  }

  const csrfToken = new Entropy({ bits: 128 })
  const { jwtExpiresInSeconds } = environment.auth
  const jwtToken = jwt.sign(
    {
      user: { ssn: user.kennitala },
      csrfToken,
    },
    jwtSecret, //TODO: Use cert to sign jwt
    { expiresIn: jwtExpiresInSeconds },
  )

  const tokenParts = jwtToken.split('.')
  if (tokenParts.length !== 3) {
    return res.redirect('/auth/error')
  }

  const [header, payload, signature] = jwtToken.split('.')
  const maxAge = jwtExpiresInSeconds * 1000

  res
    .cookie(SIGNATURE_COOKIE.name, `${signature}.${csrfToken}`, {
      ...SIGNATURE_COOKIE.options,
      maxAge,
    })
    .cookie(PAYLOAD_COOKIE.name, `${header}.${payload}`, {
      ...PAYLOAD_COOKIE.options,
      maxAge,
    })
    .redirect(returnUrl)
})

//TODO: will be better to redirect to the client here
router.get('/error', (_, res) => {
  return res.status(401).send({ message: 'Invalid auth state' })
})

router.get('/login', (req, res) => {
  const { name, options } = REDIRECT_COOKIE
  res.clearCookie(name, options)
  const authId = uuid()
  let { returnUrl = '/' } = req.query
  if (!returnUrl || String(returnUrl).charAt(0) !== '/') {
    returnUrl = '/'
  }

  // Since the authid parameter is the only usable state parameter, use it
  // to store the redirect url in a cookie. It would be best if the SAML implementation
  // supports relay state
  res
    .cookie(name, { authId, returnUrl }, { ...options, maxAge: 15 * 60 * 1000 })
    .redirect(`${samlEntryPoint}&authid=${authId}`)
})

export default router
