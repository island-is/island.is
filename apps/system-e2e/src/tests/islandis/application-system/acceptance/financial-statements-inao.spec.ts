import { BrowserContext, expect, test } from '@playwright/test'
import { helpers } from '../../../../support/locator-helpers'
import { session } from '../../../../support/session'
import { urls } from '../../../../support/urls'
import { createMockPdf, deleteMockPdf } from '../../../../support/utils'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Financial Statements INAO', () => {
  let context: BrowserContext

  test.beforeEach(async ({ browser }) => {
    context = await session({
      browser: browser,
      homeUrl: `/umsoknir/skilarsreikninga`,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })

  test.skip('should be able to create application', async () => {
    const page = await context.newPage()
    const { findByTestId, proceed } = helpers(page)

    await page.goto('/umsoknir/skilarsreikninga')

    // Check if user has existing applications and create new if it does
    const createButton = page.locator("[data-testid='create-new-application']")
    if (createButton) {
      await createButton.click()
    }

    // Information gathering
    await page.locator("[data-testid='agree-to-data-providers']").click()
    await proceed()

    // Information
    await proceed()

    // Elections
    const election = findByTestId('select-election.selectElection')
    await election.click()
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')

    await findByTestId('radio-incomeLimit-moreThan').click()
    await proceed()

    // Key figures - Revenues and expenses
    const contributionsByLegalEntities = page.locator(
      'input[name="individualIncome\\.contributionsByLegalEntities"]',
    )
    await contributionsByLegalEntities.fill('123')

    const individualContributions = page.locator(
      'input[name="individualIncome\\.individualContributions"]',
    )
    await individualContributions.fill('123')

    const candidatesOwnContributions = page.locator(
      'input[name="individualIncome\\.candidatesOwnContributions"]',
    )
    await candidatesOwnContributions.fill('123')

    const individualIncomeOtherIncome = page.locator(
      'input[name="individualIncome\\.otherIncome"]',
    )
    await individualIncomeOtherIncome.fill('123')

    const individualIncomeTotal = page.locator(
      'input[name="individualIncome\\.total"]',
    )
    await expect(individualIncomeTotal).toHaveValue('492 kr.')

    const individualExpenseElectionOffice = page.locator(
      'input[name="individualExpense\\.electionOffice"]',
    )
    await individualExpenseElectionOffice.fill('123')

    const individualExpenseAdvertisements = page.locator(
      'input[name="individualExpense\\.advertisements"]',
    )
    await individualExpenseAdvertisements.fill('123')

    const individualExpenseTravelCost = page.locator(
      'input[name="individualExpense\\.travelCost"]',
    )
    await individualExpenseTravelCost.fill('123')

    const individualExpenseOtherCost = page.locator(
      'input[name="individualExpense\\.otherCost"]',
    )
    await individualExpenseOtherCost.fill('100')

    const individualExpenseTotal = page.locator(
      'input[name="individualExpense\\.total"]',
    )
    await expect(individualExpenseTotal).toHaveValue('469 kr.')

    const operatingCostTotal = page.locator(
      'input[name="operatingCost\\.total"]',
    )
    await expect(operatingCostTotal).toHaveValue('23 kr.')
    await proceed()

    // Key figures - Financial income and financial expenses
    const capitalNumbersCapitalIncome = page.locator(
      'input[name="capitalNumbers\\.capitalIncome"]',
    )
    await capitalNumbersCapitalIncome.fill('1123')

    const capitalNumbersCapitalCost = page.locator(
      'input[name="capitalNumbers\\.capitalCost"]',
    )
    await capitalNumbersCapitalCost.fill('123')

    const capitalNumbersTotal = page.locator(
      'input[name="capitalNumbers\\.total"]',
    )
    await expect(capitalNumbersTotal).toHaveValue('1.000 kr.')
    await proceed()

    // Key figures - Assets, liabilities and equity
    const assetFixedAssetsTotal = page.locator(
      'input[name="asset\\.fixedAssetsTotal"]',
    )
    await assetFixedAssetsTotal.fill('123')

    const assetCurrentAssets = page.locator(
      'input[name="asset\\.currentAssets"]',
    )
    await assetCurrentAssets.fill('246')

    const assetTotal = page.locator('input[name="asset\\.total"]')
    await expect(assetTotal).toHaveValue('369 kr.')

    const liabilityLongTerm = page.locator('input[name="liability\\.longTerm"]')
    await liabilityLongTerm.fill('123')

    const liabilityShortTerm = page.locator('input[name="liability.shortTerm"]')
    await liabilityShortTerm.fill('123')

    const liabilityTotal = page.locator('input[name="liability\\.total"]')
    await expect(liabilityTotal).toHaveValue('246 kr.')

    const equityTotalEquity = page.locator('input[name="equity\\.totalEquity"]')
    await equityTotalEquity.fill('123')

    const equityAndLiabilitiesTotal = page.locator(
      'input[name="equityAndLiabilities.total"]',
    )
    await expect(equityAndLiabilitiesTotal).toHaveValue('369 kr.')
    await proceed()

    // Upload financial report
    createMockPdf()
    const fileChooserPromise = page.waitForEvent('filechooser')
    const fileUploadButton = page.locator('text=Velja skjöl til að hlaða upp')
    await fileUploadButton.click()
    const filechooser = await fileChooserPromise
    await filechooser.setFiles('./mockPdf.pdf')
    await page.waitForTimeout(1000)
    deleteMockPdf()
    await proceed()

    // Statement overview
    const applicationApprove = page.locator('input[name="applicationApprove"]')
    await applicationApprove.click()

    const submitButton = page.locator('button:text("Senda umsókn")')
    await submitButton.click()

    // Statement received
    await expect(page.locator('h5:has-text("Skilað")')).toBeVisible()
  })
})
