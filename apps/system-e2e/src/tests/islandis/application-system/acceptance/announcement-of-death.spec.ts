import { BrowserContext, expect, test } from '@playwright/test'
import { session } from '../../../../support/session'

test.describe('Announcement of Death', () => {
  const home = '/umsoknir/andlatstilkynningar'
  let context: BrowserContext

  test.beforeEach(async ({ browser }) => {
    context = await session({
      browser: browser,
      homeUrl: home,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
    // TODO: add mocking for listing applications, to prevent previous applications from being seen
  })
  test.afterAll(async () => {
    await context.close()
  })

  test('test', async () => {
    const page = await context.newPage()
    await page.goto(home)

    await page.locator('[data-testid="create-new-application"]').click()
    await page.locator('[data-testid="create-new-application"]').click()
    await expect(page).toBeApplication()

    await page.locator('span:has-text("Ég skil að ofangreindra upplýsinga verður aflað við úrvinnslu umsóknarinnar.")').nth(1).click()

    await page.locator('[data-testid="proceed"]').click()
    await expect(page).toBeApplication()

    await page.locator('text=Hefja umsókn').click()
    await expect(page).toBeApplication()

    await page.locator('text=Samþykki að halda áfram með tilkynningu').click()

    await page.locator('[data-testid="proceed"]').click()
    await expect(page).toBeApplication()

    await page.locator('text=Veldu tengsl').click()

    // TODO improve selectability in this screen
    await page.locator('div:text("Systir")').click()

    await page.locator('[data-testid="proceed"]').click()
    await expect(page).toBeApplication()

    await page.locator('[data-testid="proceed"]').click()
    await expect(page).toBeApplication()

    await page.locator('text=Bæta við erfingja').click()

    await page.locator('div:nth-child(5) > div > div:nth-child(2) > div > div > div > .reset_base__1r86fzb0').first().click()

    // Fill input[name="estateMembers\.members\[3\]\.nationalId"]
    await page.locator('input[name="estateMembers\\.members\\[3\\]\\.nationalId"]').fill('010130-5069 ')

    await page.locator('[id="estateMembers\\.members\\[3\\]\\.relation"] div:has-text("Tengsl")').click()

    await page.locator('[id="react-select-estateMembers\\.members\\[3\\]\\.relation-option-0"]').click()

    await page.locator('div:nth-child(5) > div > div:nth-child(2) > div:nth-child(4) > div > div > div > .Checkbox_label__jho66t4 > .Checkbox_labelText__jho66t5 > span').click()

    await page.locator('text=ErfingjarErfðaréttur byggist á skyldleika, ættleiðingu, hjúskap og erfðaskrá ein >> button').nth(3).click()

    await page.locator('[data-testid="proceed"]').click()
    await expect(page).toBeApplication()

    // Check input[name="otherProperties\[0\]"]
    await page.locator('input[name="otherProperties\\[0\\]"]').check()

    // Uncheck input[name="otherProperties\[0\]"]
    await page.locator('input[name="otherProperties\\[0\\]"]').uncheck()

    await page.locator('text=Nissan Terrano IIEyða >> span[role="button"]').click()

    await page.locator('#react-select-financesDataCollectionPermission-option-0').first().click()
    await expect(page).toBeApplication()

    await page.locator('text=Vottorð um tilkynningu andlátsHeimilar að útför hins látna megi fara fram. Prest').click()

    await page.locator('[data-testid="select-certificateOfDeathAnnouncement"] >> text=Enginn viðtakandi valinn').click()

    await page.locator('#react-select-certificateOfDeathAnnouncement-option-0').click()

    await page.locator('[data-testid="select-authorizationForFuneralExpenses"] >> text=Enginn viðtakandi valinn').click()

    await page.locator('#react-select-authorizationForFuneralExpenses-option-0').click()

    await page.locator('[data-testid="select-financesDataCollectionPermission"] label:has-text("Viðtakandi")').click()


    await page.locator('[data-testid="proceed"]').click()
    await expect(page).toBeApplication()

    await page.locator('div:nth-child(41) > div > div > div > div > div').click()

    await page.locator('textarea[name="additionalInfo"]').fill('test test þæö')

    await page.locator('text=Staðfesta andlátstilkynningu').click()
    await expect(page).toBeApplication()

    await page.locator('h2:has-text("Tilkynning móttekin")').dblclick()
  })
})
