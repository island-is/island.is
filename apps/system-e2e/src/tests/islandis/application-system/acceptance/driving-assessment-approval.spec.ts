import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  await page.goto(
    'https://cognito.shared.devland.is/login?approval_prompt=force&client_id=3rhd7sv3ik7ejgbpb6hqc647f&redirect_uri=https%3A%2F%2Fauth.shared.devland.is%2Fdev%2Foauth2%2Fcallback&response_type=code&scope=openid&state=QCaZgBH_YF6YyPfanJVnEtRYiEWsnMxgzaV8tMcPj1Y%3Ahttps%3A%2F%2Fbeta.dev01.devland.is%2Fumsoknir%2Fakstursmat',
  )
  await page.getByRole('button', { name: 'Github' }).press('Tab')
  await page.getByRole('textbox', { name: 'Username' }).press('Tab')
  await page.getByRole('textbox', { name: 'Password' }).press('Shift+Tab')
  await page
    .getByRole('textbox', { name: 'Username' })
    .fill('kristofer@juni.is')
  await page.getByRole('textbox', { name: 'Username' }).press('Tab')
  await page.getByRole('textbox', { name: 'Password' }).press('Control+Shift+V')
  await page.getByRole('textbox', { name: 'Password' }).press('Enter')
  await page.getByRole('textbox', { name: 'Símanúmer' }).fill('010-7789')
  await page.getByRole('textbox', { name: 'Símanúmer' }).press('Enter')
  await page.goto('https://beta.dev01.devland.is/umsoknir/akstursmat')
  await page.goto(
    'https://beta.dev01.devland.is/umsoknir/akstursmat/262fe822-37c5-4463-b766-b2ea80077d37',
  )
  await page.getByText('Ég hef kynnt mér ofangreint').first().click()
  await page.getByTestId('proceed').click()
  await page.getByLabel('Kennitala nemanda').click()
  await page.getByLabel('Kennitala nemanda').fill('0101307789')
  await page.getByLabel('Tölvupóstfang nemanda').click()
  await page.getByLabel('Tölvupóstfang nemanda').fill('email@email.com')
  await page.getByTestId('proceed').click()
  await page
    .getByText(
      'Ég staðfesti að akstursmat hefur farið fram í samræmi við ákvæði í reglugerð um ',
    )
    .first()
    .click()
  await page.getByRole('button', { name: 'Staðfesta' }).click()
})
