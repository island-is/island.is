import { expect, Page } from '@playwright/test'

export type TestEnvironment = 'local' | 'dev' | 'staging' | 'prod'

export enum BaseAuthority {
  dev = 'beta.dev01.devland.is',
  staging = 'beta.staging01.devland.is',
  ads = 'loftbru.dev01.devland.is',
  prod = 'island.is',
  local = 'localhost:4200',
}

export enum AuthUrl {
  dev = 'https://identity-server.dev01.devland.is',
  staging = 'https://identity-server.staging01.devland.is',
  prod = 'https://innskra.island.is',
  local = dev,
}

export const getEnvironmentBaseUrl = (authority: string) => {
  const baseurlPrefix = process.env.BASE_URL_PREFIX ?? ''
  const prefix =
    (baseurlPrefix?.length ?? 0) > 0 && baseurlPrefix !== 'main'
      ? `${baseurlPrefix}-`
      : ''
  return `https://${prefix}${authority}`
}
export const getEnvironmentUrls = (env: TestEnvironment = 'local') => {
  const envs: {
    [envName in TestEnvironment]: {
      authUrl: string
      islandisBaseUrl: string
      adsBaseUrl: string
    }
  } = {
    dev: {
      authUrl: AuthUrl.dev,
      islandisBaseUrl: getEnvironmentBaseUrl(BaseAuthority.dev),
      adsBaseUrl: getEnvironmentBaseUrl(BaseAuthority.ads),
    },
    staging: {
      authUrl: AuthUrl.staging,
      islandisBaseUrl: getEnvironmentBaseUrl(BaseAuthority.staging),
      adsBaseUrl: getEnvironmentBaseUrl('loftbru.staging01.devland.is'),
    },
    prod: {
      authUrl: AuthUrl.prod,
      islandisBaseUrl: getEnvironmentBaseUrl(BaseAuthority.prod),
      adsBaseUrl: getEnvironmentBaseUrl('loftbru.island.is'),
    },
    local: {
      authUrl: AuthUrl.local,
      islandisBaseUrl: `http://${BaseAuthority.local}`,
      adsBaseUrl: `http://${BaseAuthority.local}`,
    },
  }
  const ret = envs[env]
  if (!ret) {
    throw new Error(`Invalid test environment '${env}'`)
  }
  return ret
}
export type CognitoCreds = {
  username: string
  password: string
}
export const getCognitoCredentials = (): CognitoCreds => {
  const username = process.env.AWS_COGNITO_USERNAME
  const password = process.env.AWS_COGNITO_PASSWORD
  if (!username || !password) throw new Error('Cognito credentials missing')
  return {
    username,
    password,
  }
}
export const env = (process.env.TEST_ENVIRONMENT ?? 'local') as TestEnvironment
export const urls = getEnvironmentUrls(env)
export const cognitoLogin = async (
  page: Page,
  { username, password }: CognitoCreds,
  home: string,
  authUrl: string,
) => {
  const cognito = page.locator('form[name="cognitoSignInForm"]:visible')
  await cognito.locator('input[id="signInFormUsername"]:visible').type(username)
  const passwordInput = cognito.locator(
    'input[id="signInFormPassword"]:visible',
  )

  await passwordInput.selectText()
  await passwordInput.type(password)
  await cognito.locator('input[name="signInSubmitButton"]:visible').click()
  await page.waitForURL(new RegExp(`${home}|${authUrl}`))
}
export const idsLogin = async (
  page: Page,
  phoneNumber: string,
  home: string,
) => {
  await page.waitForURL(`${urls.authUrl}/**`, { timeout: 15000 })
  const input = await page.locator('#phoneUserIdentifier')
  await input.type(phoneNumber, { delay: 100 })

  const btn = page.locator('button[id="submitPhoneNumber"]')
  await expect(btn).toBeEnabled()
  await btn.click()
  await page.waitForURL(new RegExp(`${home}`), {
    waitUntil: 'domcontentloaded',
  })
}
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
