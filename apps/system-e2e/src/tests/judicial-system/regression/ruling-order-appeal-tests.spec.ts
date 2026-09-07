import faker from 'faker'
import { urls } from '../../../support/urls'
import { test } from '../utils/judicialSystemTest'
import {
  judgeReceivesIndictmentThroughAdvocates,
  prosecutorCreatesIndictmentCase,
  prosecutorSendsIndictmentToCourt,
} from './shared-steps/indictment-to-court-record'
import {
  judgeCreatesInCourtRulingOrderAppeal,
  judgeCreatesOrderSessionForOutOfCourtAppeal,
  judgeReceivesRulingOrderAppeal,
  judgeUploadsAndConfirmsRulingOrder,
  prosecutorAppealsRulingOrderOutOfCourt,
} from './shared-steps/ruling-order-appeal'
import { coaJudgesCompleteAppealCaseTest } from './shared-steps/complete-appeal'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe.serial('In-court ruling order appeal tests', () => {
  let caseId = ''
  let appealCaseId = ''
  const accusedName = faker.name.findName()

  test('prosecutor should create a new indictment case', async ({
    prosecutorPage,
  }) => {
    caseId = await prosecutorCreatesIndictmentCase(prosecutorPage, accusedName)
  })

  test('prosecutor should accept and send indictment case to court', async ({
    prosecutorPage,
  }) => {
    await prosecutorSendsIndictmentToCourt(prosecutorPage, caseId, accusedName)
  })

  test('judge should receive indictment case through advocates', async ({
    judgePage,
  }) => {
    await judgeReceivesIndictmentThroughAdvocates(
      judgePage,
      caseId,
      accusedName,
    )
  })

  test('judge should upload and confirm a ruling order', async ({
    judgePage,
  }) => {
    await judgeUploadsAndConfirmsRulingOrder(judgePage, caseId)
  })

  test('judge should create court session with in-court ruling order appeal', async ({
    judgePage,
  }) => {
    await judgeCreatesInCourtRulingOrderAppeal(judgePage, caseId)
  })

  test('judge should receive appealed ruling order and send to court of appeals', async ({
    judgePage,
  }) => {
    appealCaseId = await judgeReceivesRulingOrderAppeal(judgePage, caseId)
  })

  test('coa judge should submit decision in ruling order appeal case', async ({
    coaPage,
  }) => {
    await coaJudgesCompleteAppealCaseTest(coaPage, caseId, appealCaseId)
  })
})

test.describe.serial('Out-of-court ruling order appeal tests', () => {
  let caseId = ''
  let appealCaseId = ''
  const accusedName = faker.name.findName()

  test('prosecutor should create a new indictment case', async ({
    prosecutorPage,
  }) => {
    caseId = await prosecutorCreatesIndictmentCase(prosecutorPage, accusedName)
  })

  test('prosecutor should accept and send indictment case to court', async ({
    prosecutorPage,
  }) => {
    await prosecutorSendsIndictmentToCourt(prosecutorPage, caseId, accusedName)
  })

  test('judge should receive indictment case through advocates', async ({
    judgePage,
  }) => {
    await judgeReceivesIndictmentThroughAdvocates(
      judgePage,
      caseId,
      accusedName,
    )
  })

  test('judge should upload and confirm a ruling order', async ({
    judgePage,
  }) => {
    await judgeUploadsAndConfirmsRulingOrder(judgePage, caseId)
  })

  test('judge should confirm order session without in-court appeal', async ({
    judgePage,
  }) => {
    await judgeCreatesOrderSessionForOutOfCourtAppeal(judgePage, caseId)
  })

  test('prosecutor should send an out-of-court ruling order appeal', async ({
    prosecutorPage,
  }) => {
    appealCaseId = await prosecutorAppealsRulingOrderOutOfCourt(
      prosecutorPage,
      caseId,
    )
  })

  test('judge should receive appealed ruling order and send to court of appeals', async ({
    judgePage,
  }) => {
    appealCaseId = await judgeReceivesRulingOrderAppeal(judgePage, caseId)
  })

  test('coa judge should submit decision in ruling order appeal case', async ({
    coaPage,
  }) => {
    await coaJudgesCompleteAppealCaseTest(coaPage, caseId, appealCaseId)
  })
})
