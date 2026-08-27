import { expect, Page } from '@playwright/test'
import { verifyRequestCompletion } from '../../../../support/api-tools'
import {
  randomPoliceCaseNumber,
  getDaysFromNow,
  injectTestDefenderIntoLawyerRegistry,
  randomIndictmentCourtCaseNumber,
  selectTestDefender,
} from '../../utils/helpers'

export const prosecutorCreatesIndictmentCase = async (
  page: Page,
  accusedName: string,
  secondAccusedName?: string,
): Promise<string> => {
  let caseId = ''
  const today = getDaysFromNow()
  const policeCaseNumber = randomPoliceCaseNumber()

  await page.goto('/malalistar')
  await expect(page).toHaveURL('/malalistar')
  await page.getByRole('button', { name: 'Nýtt mál' }).click()
  await page.getByRole('menuitem', { name: 'Ákæra' }).click()
  await expect(page).toHaveURL('/akaera/ny')

  await page.getByTestId('policeCaseNumber0').click()
  await page.getByTestId('policeCaseNumber0').fill(policeCaseNumber)

  await page.getByText('Sakarefni *Veldu sakarefni').click()
  await page.getByRole('option', { name: 'Umferðarlagabrot' }).click()
  await page.getByPlaceholder('Sláðu inn vettvang').click()
  await page.getByPlaceholder('Sláðu inn vettvang').fill('Reykjavík')
  await page
    .locator(`input[id=crime-scene-date-${policeCaseNumber}]`)
    .fill(today)
  await page.keyboard.press('Escape')

  const nationalIdInput = page.getByTestId('inputNationalId')
  const nameInput = page.getByTestId('inputName')

  await Promise.all([
    page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/nationalRegistry/getPersonByNationalId') &&
        resp.request().method() === 'GET',
    ),
    nationalIdInput.fill('000000-0000'),
  ])

  await nameInput.fill(accusedName)
  await nameInput.press('Tab')
  await expect(nameInput).toHaveValue(accusedName)

  if (secondAccusedName) {
    // The case does not exist yet, so this only adds a defendant locally -
    // it is persisted with a CreateDefendant mutation when the case is
    // created below. The second defendant has no Icelandic national id to
    // avoid a duplicate national registry lookup.
    await page.getByTestId('addDefendantButton').click()
    await page
      .getByRole('checkbox', {
        name: 'Varnaraðili er ekki með íslenska kennitölu',
      })
      .last()
      .check()
    await page.getByTestId('inputNationalId').last().fill('12.12.2000')
    const secondNameInput = page.getByTestId('inputName').last()
    await secondNameInput.fill(secondAccusedName)
    await page.getByTestId('accusedAddress').last().fill('Einhversstaðar 2')
    await secondNameInput.press('Tab')
    await expect(secondNameInput).toHaveValue(secondAccusedName)
  }

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'CreateCase').then(
      (res) => (caseId = res.data.createCase.id),
    ),
    ...(secondAccusedName
      ? [verifyRequestCompletion(page, '/api/graphql', 'CreateDefendant')]
      : []),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.getByRole('button', { name: 'Stofna mál' }).click(),
  ])

  await expect(page).toHaveURL(`/akaera/malsgogn/${caseId}`)
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.getByTestId('continueButton').click(),
  ])

  await expect(page).toHaveURL(`/akaera/skjalaskra/${caseId}`)
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.getByTestId('continueButton').click(),
  ])

  await expect(page).toHaveURL(`/akaera/domskjol/${caseId}`)
  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
    page.getByTestId('continueButton').click(),
  ])

  await expect(page).toHaveURL(`/akaera/malsmedferd/${caseId}`)

  // One plea per defendant
  const pleaOptions = page.getByText('Játar sök')
  await expect(pleaOptions.first()).toBeVisible()
  const pleaCount = await pleaOptions.count()
  for (let i = 0; i < pleaCount; i++) {
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'UpdateDefendant'),
      pleaOptions.nth(i).click(),
    ])
  }

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
    page.getByText('Nei').last().click(),
  ])

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.getByTestId('continueButton').click(),
  ])

  // The auto-created indictment count is expanded by default (open state is
  // persisted in local storage), so no "Opna alla" toggle is needed.
  await page.getByPlaceholder('AB123').fill('AB123')

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'UpdateIndictmentCount'),
    page.keyboard.press('Tab'),
  ])

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'UpdateIndictmentCount'),
    page.getByText('Brot *Veldu brot').click(),
    page.getByRole('option', { name: 'Sviptingarakstur' }).click(),
  ])

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'UpdateCase'),
    page.getByLabel('Krefjast sviptingarKrefjast').check(),
  ])

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.getByTestId('continueButton').click(),
  ])

  await expect(page).toHaveURL(`/akaera/stadfesta/${caseId}`)

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'TransitionCase'),
    page.getByTestId('continueButton').click(),
  ])
  await page.getByTestId('modalPrimaryButton').click()

  return caseId
}

export const prosecutorSendsIndictmentToCourt = async (
  page: Page,
  caseId: string,
  accusedName: string,
) => {
  await page.goto('/malalistar/sakamal-sem-bida-stadfestingar')
  await expect(page).toHaveURL('/malalistar/sakamal-sem-bida-stadfestingar')
  await page.getByText(accusedName).click()

  await expect(page).toHaveURL(`/akaera/stadfesta/${caseId}`)

  await page.getByText('Staðfesta ákæru og senda á dómstól').click()
  await page.getByTestId('continueButton').click()

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'TransitionCase'),
    page.getByTestId('modalPrimaryButton').click(),
  ])
}

export const judgeReceivesIndictmentThroughAdvocates = async (
  page: Page,
  caseId: string,
  accusedName: string,
  options?: {
    // Assign the test defender on the advocates screen instead of the
    // defendants waiving their right to counsel
    assignDefender?: boolean
  },
) => {
  const nextWeek = getDaysFromNow(7)

  if (options?.assignDefender) {
    await injectTestDefenderIntoLawyerRegistry(page)
  }

  await page.goto('/malalistar/sakamal-sem-bida-uthlutunar')
  await expect(page).toHaveURL('/malalistar/sakamal-sem-bida-uthlutunar')
  await page.getByText(accusedName).click()

  await expect(page).toHaveURL(`domur/akaera/yfirlit/${caseId}`)

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.getByTestId('continueButton').click(),
  ])

  await expect(page).toHaveURL(`domur/akaera/mottaka/${caseId}`)

  await page
    .getByTestId('courtCaseNumber')
    .fill(randomIndictmentCourtCaseNumber())
  await page.keyboard.press('Tab')

  await page.getByText('Veldu dómara/aðstoðarmann').click()
  await page.getByTestId('select-judge').getByText('Test Dómari').last().click()

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.getByTestId('continueButton').click(),
  ])

  await expect(page).toHaveURL(`domur/akaera/fyrirkall/${caseId}`)

  // One subpoena type per defendant
  const subpoenaTypeOptions = page
    .locator('label')
    .filter({ hasText: 'Útivistarfyrirkall' })
  await expect(subpoenaTypeOptions.first()).toBeVisible()
  const subpoenaTypeCount = await subpoenaTypeOptions.count()
  for (let i = 0; i < subpoenaTypeCount; i++) {
    await subpoenaTypeOptions.nth(i).click()
  }

  await page.locator('input[id=courtDate]').fill(nextWeek)
  await page.keyboard.press('Escape')

  await page.getByTestId('courtDate-time').fill('11:00')
  await page.getByTestId('courtroom').press('Tab')

  await page.getByTestId('courtroom').fill('12')
  await page.getByTestId('courtroom').press('Tab')

  await page.getByTestId('continueButton').click()
  await page.getByTestId('modalPrimaryButton').click()

  await expect(page).toHaveURL(`domur/akaera/malflytjendur/${caseId}`)

  if (options?.assignDefender) {
    // Assign the test defender from the lawyer registry; selecting fires an
    // UpdateDefendant with the defender fields
    await selectTestDefender(page)
    await page.getByRole('button', { name: 'Staðfesta val' }).click()
    await Promise.all([
      verifyRequestCompletion(page, '/api/graphql', 'UpdateDefendant'),
      page.getByTestId('modalPrimaryButton').click(),
    ])
    await expect(page.getByText('Verjandi staðfestur')).toBeVisible()
  } else {
    // One defender choice per defendant
    const defenderChoiceOptions = page
      .locator('label')
      .filter({ hasText: 'óskar ekki eftir að sé' })
    await expect(defenderChoiceOptions.first()).toBeVisible()
    const defenderChoiceCount = await defenderChoiceOptions.count()
    for (let i = 0; i < defenderChoiceCount; i++) {
      await defenderChoiceOptions.nth(i).click()
    }
    await page.getByRole('button', { name: 'Staðfesta val' }).click()
    await page.getByTestId('modalPrimaryButton').click()
  }

  await Promise.all([
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
    page.getByTestId('continueButton').click(),
  ])

  await expect(page).toHaveURL(`domur/akaera/thingbok/${caseId}`)
}
