import { expect } from '@playwright/test'
import faker from 'faker'
import { urls } from '../../../support/urls'
import { verifyRequestCompletion } from '../../../support/api-tools'
import { test } from '../utils/judicialSystemTest'
import { getDaysFromNow } from '../utils/helpers'
import { prosecutorCreatesCustodyRequest } from './shared-steps/create-restriction-case'
import { judgeSubmitsDecision } from './shared-steps/court-decision'
import { prosecutorAppealsCaseTest } from './shared-steps/send-appeal'

test.use({ baseURL: urls.judicialSystemBaseUrl })

test.describe.serial('Custody rejection tests', () => {
  let caseId = ''
  const accusedName = faker.name.findName()
  const requestedCustodyEndDate = getDaysFromNow(3)

  test('prosecutor should submit a custody request to court', async ({
    prosecutorPage,
  }) => {
    caseId = await prosecutorCreatesCustodyRequest(
      prosecutorPage,
      accusedName,
      requestedCustodyEndDate,
    )
  })

  test('court should reject the custody request', async ({ judgePage }) => {
    // Rejected cases have no restriction length, so no validToDate is set
    await judgeSubmitsDecision(judgePage, caseId, {
      decisionText: 'Kröfu um gæsluvarðhald hafnað',
      dismissSignatureModal: true,
    })
  })

  test('prosecutor should see the rejected case and open the request pdf', async ({
    prosecutorPage,
  }) => {
    const page = prosecutorPage

    await Promise.all([
      page.goto(`/krafa/yfirlit/${caseId}`),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])
    await expect(page).toHaveURL(`/krafa/yfirlit/${caseId}`)
    await expect(
      page.getByRole('heading', { name: 'Kröfu hafnað' }),
    ).toBeVisible()

    // PdfButton opens the pdf in a new tab via window.open
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('requestPDFButton').click(),
    ])
    await popup.waitForURL(new RegExp(`/api/case/${caseId}/request`), {
      waitUntil: 'commit',
    })

    // The endpoint actually serves a pdf
    const response = await page.request.get(popup.url())
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('application/pdf')
    await popup.close()
  })

  test('prosecutor should appeal the rejected ruling', async ({
    prosecutorPage,
  }) => {
    await prosecutorAppealsCaseTest(prosecutorPage, caseId)
  })

  test('prosecutor should withdraw the appeal', async ({ prosecutorPage }) => {
    const page = prosecutorPage

    // Withdrawal lives in the appealed-cases table row context menu
    await page.goto('/malalistar/rannsoknarmal-i-kaeuferli')
    await expect(page).toHaveURL('/malalistar/rannsoknarmal-i-kaeuferli')

    const caseRow = page.getByRole('row').filter({ hasText: accusedName })
    await caseRow
      .getByRole('button', { name: /Frekari aðgerðir/ })
      .first()
      .click()
    await page.getByText('Afturkalla kæru').click()
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'TransitionAppealCase'),
      page.getByTestId('modalPrimaryButton').click(),
    ])

    // The case overview shows the withdrawn appeal state
    await Promise.all([
      page.goto(`/krafa/yfirlit/${caseId}`),
      verifyRequestCompletion(page, '/api/graphql', 'Case'),
    ])
    await expect(page.getByText('Afturkallað').first()).toBeVisible()
  })
})
