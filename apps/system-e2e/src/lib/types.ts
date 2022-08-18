import type { AuthUser, Discount } from '@island.is/air-discount-scheme/types'

type TestEnvironment = 'local' | 'dev' | 'staging' | 'prod'

enum AuthUrl {
  dev = 'https://identity-server.dev01.devland.is',
  staging = 'https://identity-server.staging01.devland.is',
  prod = 'https://innskra.island.is',
  local = dev,
}

enum BaseUrl {
  dev = 'https://beta.dev01.devland.is',
  staging = 'https://beta.staging01.devland.is',
  ads = 'https://loftbru.dev01.devland.is',
  prod = 'https://island.is',
  local = 'http://localhost:4200',
}

type AuthUserWithDiscount = Discount & {
  user: AuthUser
}

interface TestURLs {
  authUrl: AuthUrl
  baseUrl: BaseUrl
}

type CognitoCreds = {
  username: string
  password: string
}

type FakeChild = {
  name: string
  nationalId: string
}

type FakeUser = {
  name: string
  phoneNumber: string
  nationalId?: string
  children?: FakeChild[]
}

interface IDSLogin {
  phoneNumber: string
  baseUrl: BaseUrl
  urlPath: string
}

export type {
  CognitoCreds,
  IDSLogin,
  FakeUser,
  FakeChild,
  TestURLs,
  TestEnvironment,
  AuthUserWithDiscount,
  AuthUser,
  Discount,
}

export { AuthUrl, BaseUrl }
