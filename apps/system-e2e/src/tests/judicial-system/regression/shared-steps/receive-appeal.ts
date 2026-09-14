import { expect, Page } from '@playwright/test'
import { verifyRequestCompletion } from '../../../../support/api-tools'

export const judgeReceivesAppealTest = async (page: Page, caseId: string) => {
  await Promise.all([
    page.goto(`krafa/yfirlit/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])
  const sendNotificationButton = page.getByRole('button', {
    name: 'Senda tilkynningu um kæru til Landsréttar',
  })
  await expect(sendNotificationButton).toBeVisible()
  await sendNotificationButton.click()
  await page.getByTestId('modalPrimaryButton').click()
  await expect(page.getByText('Tilkynning um móttöku send')).toBeVisible()
}
