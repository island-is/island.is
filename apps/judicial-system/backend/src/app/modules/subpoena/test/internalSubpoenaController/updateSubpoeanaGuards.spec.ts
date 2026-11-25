import { verifyGuards } from '../../../../test'
import { CaseExistsForUpdateGuard } from '../../../case'
import { PoliceSubpoenaExistsGuard } from '../../guards/policeSubpoenaExists.guard'
import { SubpoenaOnCaseGuard } from '../../guards/subpoenaOnCase.guard'
import { InternalSubpoenaController } from '../../internalSubpoena.controller'

// The subpoena lookup supplies the case id the locking read needs, so it
// stays first; the subpoena is then re-taken from the locked case.
// subpoenaGuardChain.spec.ts runs the chain.
describe('InternalSubpoenaController - Update subpoena guards', () => {
  verifyGuards(InternalSubpoenaController, 'updateSubpoena', [
    PoliceSubpoenaExistsGuard,
    CaseExistsForUpdateGuard,
    SubpoenaOnCaseGuard,
  ])
})
