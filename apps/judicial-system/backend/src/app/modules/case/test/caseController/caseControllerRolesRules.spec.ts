import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  defenderRule,
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CaseController } from '../../case.controller'
import {
  courtOfAppealsAssistantTransitionRule,
  courtOfAppealsAssistantUpdateRule,
  courtOfAppealsJudgeTransitionRule,
  courtOfAppealsJudgeUpdateRule,
  courtOfAppealsRegistrarTransitionRule,
  courtOfAppealsRegistrarUpdateRule,
  districtCourtAssistantTransitionRule,
  districtCourtAssistantUpdateRule,
  districtCourtJudgeSignRulingRule,
  districtCourtJudgeTransitionRule,
  districtCourtJudgeUpdateRule,
  districtCourtRegistrarTransitionRule,
  districtCourtRegistrarUpdateRule,
  prosecutorRepresentativeTransitionRule,
  prosecutorRepresentativeUpdateRule,
  prosecutorTransitionRule,
  prosecutorUpdateRule,
  publicProsecutorStaffUpdateRule,
} from '../../guards/rolesRules'

describe('CaseController - Create rules', () => {
  verifyRolesRules(CaseController, 'create', [
    prosecutorRule,
    prosecutorRepresentativeRule,
  ])
})

describe('CaseController - Update rules', () => {
  verifyRolesRules(CaseController, 'update', [
    prosecutorUpdateRule,
    prosecutorRepresentativeUpdateRule,
    districtCourtJudgeUpdateRule,
    districtCourtRegistrarUpdateRule,
    districtCourtAssistantUpdateRule,
    courtOfAppealsJudgeUpdateRule,
    courtOfAppealsRegistrarUpdateRule,
    courtOfAppealsAssistantUpdateRule,
    publicProsecutorStaffUpdateRule,
  ])
})

describe('CaseController - Transition rules', () => {
  verifyRolesRules(CaseController, 'transition', [
    prosecutorTransitionRule,
    prosecutorRepresentativeTransitionRule,
    districtCourtJudgeTransitionRule,
    districtCourtRegistrarTransitionRule,
    districtCourtAssistantTransitionRule,
    courtOfAppealsJudgeTransitionRule,
    courtOfAppealsRegistrarTransitionRule,
    courtOfAppealsAssistantTransitionRule,
  ])
})

describe('CaseController - Get all rules', () => {
  verifyRolesRules(CaseController, 'getAll', [defenderRule])
})

describe('CaseController - Get by id rules', () => {
  verifyRolesRules(CaseController, 'getById', [
    prosecutorRule,
    prosecutorRepresentativeRule,
    publicProsecutorStaffRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  ])
})

describe('CaseController - Get connected cases rules', () => {
  verifyRolesRules(CaseController, 'getConnectedCases', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})

describe('CaseController - Get request pdf rules', () => {
  verifyRolesRules(CaseController, 'getRequestPdf', [
    prosecutorRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  ])
})

describe('CaseController - Get case files record pdf rules', () => {
  verifyRolesRules(CaseController, 'getCaseFilesRecordPdf', [
    prosecutorRule,
    prosecutorRepresentativeRule,
    publicProsecutorStaffRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})

describe('CaseController - Get court record pdf rules', () => {
  verifyRolesRules(CaseController, 'getCourtRecordPdf', [
    prosecutorRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
    publicProsecutorStaffRule,
  ])
})

describe('CaseController - Get ruling pdf rules', () => {
  verifyRolesRules(CaseController, 'getRulingPdf', [
    prosecutorRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  ])
})

describe('CaseController - Get custody notice pdf rules', () => {
  verifyRolesRules(CaseController, 'getCustodyNoticePdf', [
    prosecutorRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})

describe('CaseController - Get indictment pdf rules', () => {
  verifyRolesRules(CaseController, 'getIndictmentPdf', [
    prosecutorRule,
    prosecutorRepresentativeRule,
    publicProsecutorStaffRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})

describe('CaseController - Get ruling sent to prison admin pdf rules', () => {
  verifyRolesRules(CaseController, 'getRulingSentToPrisonAdminPdf', [
    publicProsecutorStaffRule,
  ])
})

describe('CaseController - Request court record signature rules', () => {
  verifyRolesRules(CaseController, 'requestCourtRecordSignature', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})

describe('CaseController - Get court record signature confirmation rules', () => {
  verifyRolesRules(CaseController, 'getCourtRecordSignatureConfirmation', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})

describe('CaseController - Request ruling signature rules', () => {
  verifyRolesRules(CaseController, 'requestRulingSignature', [
    districtCourtJudgeSignRulingRule,
  ])
})

describe('CaseController - Get ruling signature confirmation rules', () => {
  verifyRolesRules(CaseController, 'getRulingSignatureConfirmation', [
    districtCourtJudgeSignRulingRule,
  ])
})

describe('CaseController - Extend rules', () => {
  verifyRolesRules(CaseController, 'extend', [prosecutorRule])
})

describe('CaseController - Create court case rules', () => {
  verifyRolesRules(CaseController, 'createCourtCase', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})
