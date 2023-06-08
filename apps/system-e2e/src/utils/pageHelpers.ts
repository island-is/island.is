import { Page } from '@playwright/test'

export const getTextboxByName = (page: Page, name: string) =>
  page.getByRole('textbox', { name })
