import { rest } from 'msw'
import { URL } from 'url'
import { LicenseTypeScopesGuard } from '../../guards/licenseTypeScope.guard'
import { LicenseId, LicenseUpdateType } from '../../license.types'
import {
  REVOKE_PASS_RESPONSE,
  UPDATE_PASS_RESPONSE,
  VERIFY_PASS_RESPONSE,
} from './responses'

const url = (path: string) => new URL(path, 'http://localhost').toString()

export const requestHandlers = [
  rest.put(
    'http://localhost/users/.nationalId/licenses/disability',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(UPDATE_PASS_RESPONSE))
    },
  ),
  rest.delete(url('users/.nationalId/licenses/:licenseId'), (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(REVOKE_PASS_RESPONSE))
  }),
  rest.post(url('licenses/verify'), (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(VERIFY_PASS_RESPONSE))
  }),
]
