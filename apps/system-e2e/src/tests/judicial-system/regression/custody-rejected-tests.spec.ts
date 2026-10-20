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

    // PdfButton opens the pdf in a new tab via window.open. Headless
    // Chromium turns a pdf navigation into a download, so the popup never
    // commits a url; catch the request it fires on the context instead.
    const [pdfRequest] = await Promise.all([
      page
        .context()
        .waitForEvent('request', (request) =>
          request.url().includes(`/api/case/${caseId}/request`),
        ),
      page.getByTestId('requestPDFButton').click(),
    ])

    // The endpoint actually serves a pdf
    const response = await page.request.get(pdfRequest.url())
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('application/pdf')
  })

  test('prosecutor should appeal the rejected ruling', async ({
    prosecutorPage,
  }) => {
    await prosecutorAppealsCaseTest(prosecutorPage, caseId)
  })

  test('prosecutor should withdraw the appeal', async ({ prosecutorPage }) => {
    const page = prosecutorPage

    // Withdrawal lives in the appealed-cases table row context menu. Table
    // rows carry role="button" (the row itself opens the case), so they are
    // located as plain tr elements.
    await page.goto('/malalistar/rannsoknarmal-i-kaeuferli')
    await expect(page).toHaveURL('/malalistar/rannsoknarmal-i-kaeuferli')

    const caseRow = page.locator('tr').filter({ hasText: accusedName })
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
