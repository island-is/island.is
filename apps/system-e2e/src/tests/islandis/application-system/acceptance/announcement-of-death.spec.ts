import { test, expect } from '@playwright/test'
import { idsLogin } from '../../../../support/login'

test.describe('Announcement of Death', () => {
  const home='/umsoknir/andlatstilkynningar'
  test.beforeEach(async ({ page }) => {
    await idsLogin(page, '0102399', home)
    await page.goto(home)
    // TODO: add mocking for listing applications, to prevent previous applications from being seen
  })

  test('test', async ({ page }) => {

    // Click [data-testid="create-new-application"]
    await page.locator('[data-testid="create-new-application"]').click()

    // Click [data-testid="create-new-application"]
    await page.locator('[data-testid="create-new-application"]').click()
    await expect(page).toBeApplication()

    // Click span:has-text("Ég skil að ofangreindra upplýsinga verður aflað við úrvinnslu umsóknarinnar.") >> nth=1
    await page.locator('span:has-text("Ég skil að ofangreindra upplýsinga verður aflað við úrvinnslu umsóknarinnar.")').nth(1).click()

    // Click [data-testid="proceed"]
    await page.locator('[data-testid="proceed"]').click()
    await expect(page).toHaveURL('https://beta.dev01.devland.is/umsoknir/andlatstilkynningar/28179c9c-fb58-4381-9c2b-bb2602adc201')

    // Click text=Hefja umsókn
    await page.locator('text=Hefja umsókn').click()
    await expect(page).toHaveURL('https://beta.dev01.devland.is/umsoknir/andlatstilkynningar/28179c9c-fb58-4381-9c2b-bb2602adc201')

    // Click text=Samþykki að halda áfram með tilkynningu
    await page.locator('text=Samþykki að halda áfram með tilkynningu').click()

    // Click button:has-text("Halda áfram")
    await page.locator('button:has-text("Halda áfram")').click()
    await expect(page).toHaveURL('https://beta.dev01.devland.is/umsoknir/andlatstilkynningar/28179c9c-fb58-4381-9c2b-bb2602adc201')

    // Click text=Veldu tengsl
    await page.locator('text=Veldu tengsl').click()

    // Click #react-select-applicantRelation-option-0
    await page.locator('#react-select-applicantRelation-option-0').click()

    // Click [data-testid="proceed"]
    await page.locator('[data-testid="proceed"]').click()
    await expect(page).toHaveURL('https://beta.dev01.devland.is/umsoknir/andlatstilkynningar/28179c9c-fb58-4381-9c2b-bb2602adc201')

    // Click [data-testid="proceed"]
    await page.locator('[data-testid="proceed"]').click()
    await expect(page).toHaveURL('https://beta.dev01.devland.is/umsoknir/andlatstilkynningar/28179c9c-fb58-4381-9c2b-bb2602adc201')

    // Click text=Til baka
    await page.locator('text=Til baka').click()
    await expect(page).toHaveURL('https://beta.dev01.devland.is/umsoknir/andlatstilkynningar/28179c9c-fb58-4381-9c2b-bb2602adc201')

    // Click text=Bæta við erfingja
    await page.locator('text=Bæta við erfingja').click()

    // Click div:nth-child(5) > div > div:nth-child(2) > div > div > div > .reset_base__1r86fzb0 >> nth=0
    await page.locator('div:nth-child(5) > div > div:nth-child(2) > div > div > div > .reset_base__1r86fzb0').first().click()

    // Fill input[name="estateMembers\.members\[3\]\.nationalId"]
    await page.locator('input[name="estateMembers\\.members\\[3\\]\\.nationalId"]').fill('010130-5069 ')

    // Click [id="estateMembers\.members\[3\]\.relation"] div:has-text("Tengsl")
    await page.locator('[id="estateMembers\\.members\\[3\\]\\.relation"] div:has-text("Tengsl")').click()

    // Click [id="react-select-estateMembers\.members\[3\]\.relation-option-0"]
    await page.locator('[id="react-select-estateMembers\\.members\\[3\\]\\.relation-option-0"]').click()

    // Click div:nth-child(5) > div > div:nth-child(2) > div:nth-child(4) > div > div > div > .Checkbox_label__jho66t4 > .Checkbox_labelText__jho66t5 > span
    await page.locator('div:nth-child(5) > div > div:nth-child(2) > div:nth-child(4) > div > div > div > .Checkbox_label__jho66t4 > .Checkbox_labelText__jho66t5 > span').click()

    // Click text=ErfingjarErfðaréttur byggist á skyldleika, ættleiðingu, hjúskap og erfðaskrá ein >> button >> nth=3
    await page.locator('text=ErfingjarErfðaréttur byggist á skyldleika, ættleiðingu, hjúskap og erfðaskrá ein >> button').nth(3).click()

    // Click [data-testid="proceed"]
    await page.locator('[data-testid="proceed"]').click()
    await expect(page).toHaveURL('https://beta.dev01.devland.is/umsoknir/andlatstilkynningar/28179c9c-fb58-4381-9c2b-bb2602adc201')

    // Check input[name="otherProperties\[0\]"]
    await page.locator('input[name="otherProperties\\[0\\]"]').check()

    // Uncheck input[name="otherProperties\[0\]"]
    await page.locator('input[name="otherProperties\\[0\\]"]').uncheck()

    // Click text=Nissan Terrano IIEyða >> span[role="button"]
    await page.locator('text=Nissan Terrano IIEyða >> span[role="button"]').click()

    // Click text=Halda áframTil baka >> div >> nth=0
    await page.locator('text=Halda áframTil baka >> div').first().click()
    await expect(page).toHaveURL('https://beta.dev01.devland.is/umsoknir/andlatstilkynningar/28179c9c-fb58-4381-9c2b-bb2602adc201')

    // Click text=Vottorð um tilkynningu andlátsHeimilar að útför hins látna megi fara fram. Prest
    await page.locator('text=Vottorð um tilkynningu andlátsHeimilar að útför hins látna megi fara fram. Prest').click()

    // Click [data-testid="select-certificateOfDeathAnnouncement"] >> text=Enginn viðtakandi valinn
    await page.locator('[data-testid="select-certificateOfDeathAnnouncement"] >> text=Enginn viðtakandi valinn').click()

    // Click #react-select-certificateOfDeathAnnouncement-option-0
    await page.locator('#react-select-certificateOfDeathAnnouncement-option-0').click()

    // Click [data-testid="select-authorizationForFuneralExpenses"] >> text=Enginn viðtakandi valinn
    await page.locator('[data-testid="select-authorizationForFuneralExpenses"] >> text=Enginn viðtakandi valinn').click()

    // Click #react-select-authorizationForFuneralExpenses-option-0
    await page.locator('#react-select-authorizationForFuneralExpenses-option-0').click()

    // Click [data-testid="select-financesDataCollectionPermission"] label:has-text("Viðtakandi")
    await page.locator('[data-testid="select-financesDataCollectionPermission"] label:has-text("Viðtakandi")').click()

    // Click #react-select-financesDataCollectionPermission-option-0
    await page.locator('#react-select-financesDataCollectionPermission-option-0').click()

    // Click [data-testid="proceed"]
    await page.locator('[data-testid="proceed"]').click()
    await expect(page).toHaveURL('https://beta.dev01.devland.is/umsoknir/andlatstilkynningar/28179c9c-fb58-4381-9c2b-bb2602adc201')

    // Click div:nth-child(41) > div > div > div > div > div
    await page.locator('div:nth-child(41) > div > div > div > div > div').click()

    // Fill textarea[name="additionalInfo"]
    await page.locator('textarea[name="additionalInfo"]').fill('test test þæö')

    // Click text=Staðfesta andlátstilkynningu
    await page.locator('text=Staðfesta andlátstilkynningu').click()
    await expect(page).toHaveURL('https://beta.dev01.devland.is/umsoknir/andlatstilkynningar/28179c9c-fb58-4381-9c2b-bb2602adc201')

    // Double click h2:has-text("Tilkynning móttekin")
    await page.locator('h2:has-text("Tilkynning móttekin")').dblclick()

  })
})
