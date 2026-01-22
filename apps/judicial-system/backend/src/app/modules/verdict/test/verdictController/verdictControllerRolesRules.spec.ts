import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prisonSystemStaffRule,
  publicProsecutorStaffRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { VerdictController } from '../../verdict.controller'

describe('VerdictController - Create Verdicts Roles', () => {
  verifyRolesRules(VerdictController, 'createVerdicts', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})

describe('VerdictController - Update Roles', () => {
  verifyRolesRules(VerdictController, 'update', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    publicProsecutorStaffRule,
  ])
})

describe('VerdictController - Get Service Certificate Pdf Roles', () => {
  verifyRolesRules(VerdictController, 'getServiceCertificatePdf', [
    publicProsecutorStaffRule,
    prisonSystemStaffRule,
  ])
})

describe('VerdictController - Get Verdict Roles', () => {
  verifyRolesRules(VerdictController, 'getVerdict', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    publicProsecutorStaffRule,
  ])
})

describe('VerdictController - Deliver Case Verdict Roles', () => {
  verifyRolesRules(VerdictController, 'deliverCaseVerdict', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})
