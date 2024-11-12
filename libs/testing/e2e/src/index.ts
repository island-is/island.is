// API utilities
export {
  graphqlSpy,
  mockApi,
  verifyRequestCompletion,
} from './lib/support/api-tools'

// App initialization
export { createApplication } from './lib/support/application'

// Feature disablers for tests
export {
  mockGQL,
  disableObjectKey,
  disablePreviousApplications,
  disableI18n,
  disableDelegations,
} from './lib/support/disablers'

// Email helpers
export {
  makeEmailAccount,
  registerEmailAddressWithSES,
} from './lib/support/email-account'

// Localization
export { label } from './lib/support/i18n'

// Locator helpers
export { locatorByRole, helpers } from './lib/support/locator-helpers'

// Authentication
export {
  CognitoCreds,
  cognitoLogin,
  idsLogin,
  switchUser,
} from './lib/support/login'

// Session management
export {
  sessionsPath,
  session,
  judicialSystemSession,
} from './lib/support/session'

// Environment utilities
export {
  TestEnvironment,
  BaseAuthority,
  shouldSkipNavigation,
  getEnvironmentBaseUrl,
  icelandicAndNoPopupUrl,
  env,
  urls,
} from './lib/support/urls'

// Miscellaneous utilities
export { sleep, createMockPdf, deleteMockPdf, debug } from './lib/support/utils'

// Page helpers
export { getInputByName, getTextareaByName } from './lib/support/pageHelpers'

// Configuration
export { createPlaywrightConfig } from './lib/config/playwright-config'

// Playwright-specific exports
export { test, expect, BrowserContext, Page, Locator } from '@playwright/test'
