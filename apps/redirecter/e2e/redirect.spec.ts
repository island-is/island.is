import { test, expect } from '@playwright/test'

test.use({
  baseURL: 'http://localhost:4200',
})

test('test', async ({ page }) => {
  await page.goto('/')

  await page.goto('/test-nonexistent')
  await expect(page).toHaveURL('/404')

  for (const [source, destination] of Object.entries({
    '/test-nx': 'https://nx.dev',
    '/test-relative': '/about',
    '/test-absolute': '/about',
    '/test-func': '/about#t_st-f_nc',
    '/test-devland': 'https://island.is', //'https://beta.dev01.devland.is/',
  })) {
    await page.goto('/')
    await page.goto(source)
    await expect(page).toHaveURL(destination)
  }
})
