import { test } from '@playwright/test'
import * as prosecutor from './custody-prosecutor'
import * as court from './custody-court'

test.describe.serial('Custody tests', () => {
  prosecutor.addTests()
  court.addTests()
})
