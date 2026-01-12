import { publicProsecutorStaffRule } from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { FileController } from '../../file.controller'

describe('FileController - Create defendant case file rules', () => {
  verifyRolesRules(FileController, 'createDefendantCaseFile', [
    publicProsecutorStaffRule,
  ])
})
