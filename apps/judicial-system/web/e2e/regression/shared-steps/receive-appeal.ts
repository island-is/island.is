import { Page } from '@playwright/test'

import { verifyRequestCompletion } from '@island.is/e2e-shared'

export const judgeReceivesAppealTest = async (page: Page, caseId: string) => {
  await Promise.all([
    page.goto(`krafa/yfirlit/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])
  await page
    .getByRole('button', {
      name: 'Senda tilkynningu um kæru til Landsréttar',
    })
    .click()
  await page.getByTestId('modalPrimaryButton').click()
}
