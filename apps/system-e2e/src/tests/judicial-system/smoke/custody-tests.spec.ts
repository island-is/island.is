import { test } from '@playwright/test'
import * as prosecutor from './custody-prosecutor'
import * as court from './custody-court'

test.describe.serial('Custody tests', () => {
  // These tests are run serially because they are a part of
  // a chain of events that need to happen in a specific order.
  prosecutor.addTests()
  court.addTests()
})
