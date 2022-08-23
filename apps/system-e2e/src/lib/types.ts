import type {
  AuthUser as ADSUser,
  Discount as ADSDiscount,
} from '@island.is/air-discount-scheme/types'

type TestEnvironment = 'local' | 'dev' | 'staging' | 'prod'

type Mobile = {
  mobile: string
}

type BaseUser = {
  nationalId: string
  name: string
}

type FixtureUser = BaseUser & Mobile

enum Timeout {
  long = 60000,
  medium = long / 2,
  short = Math.floor(medium / 2),
}

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

type ADSUserWithDiscount = ADSDiscount & {
  user: ADSUser
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
  authUrl: AuthUrl
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
  ADSUserWithDiscount,
  ADSUser,
  ADSDiscount,
  FixtureUser,
}

export { AuthUrl, BaseUrl, Timeout }
