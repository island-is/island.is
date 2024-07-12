import { Locator, Page } from '@island.is/playwright-tests'

type Roles = 'heading' | 'button' | 'radio'
export const locatorByRole = (
  role: Roles | string,
  name: string | { name: string },
): string =>
  typeof name === 'string'
    ? `role=${role}[name="${name}"]`
    : `role=${role}[name="${name.name}"]`
export const helpers = (page: Page) => {
  return {
    findByRole: (
      role: Roles | string,
      name: string | { name: string },
    ): Locator => {
      return page.locator(locatorByRole(role, name))
    },
    findByTestId: (name: string): Locator =>
      page.locator(`[data-testid="${name}"]`),
    proceed: async () => await page.locator('[data-testid="proceed"]').click(),
  }
}
