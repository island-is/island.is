import { Page } from '@playwright/test'

export async function judgeReceivesAppealTest(page: Page, caseId: string) {
  await page.goto(`krafa/yfirlit/${caseId}`)
  await page
    .getByRole('button', {
      name: 'Senda tilkynningu um kæru til Landsréttar',
    })
    .click()
  await page.getByTestId('modalPrimaryButton').click()
}
