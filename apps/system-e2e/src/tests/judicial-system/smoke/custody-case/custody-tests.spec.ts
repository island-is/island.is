import faker from 'faker'
import { test } from '@playwright/test'

import * as prosecutor from './custody-prosecutor'
import * as court from './custody-court'
import * as coa from './custody-coa'

// These tests are run serially because they are a part of
// a chain of events that need to happen in a specific order.
test.describe.serial('Custody tests', () => {
  const accusedName = faker.name.findName()
  const policeCaseNumber = randomPoliceCaseNumber()
  const caseNumber = randomCourtCaseNumber()
  const appealCaseNumber = randomAppealCaseNumber()

  prosecutor.createNewCustodyCase(accusedName, policeCaseNumber)
  court.completeCaseRuling(accusedName, policeCaseNumber, caseNumber)
  prosecutor.appealCase(accusedName, policeCaseNumber, caseNumber)
  court.receiveAppeal(caseNumber, policeCaseNumber, accusedName)
  coa.completeAppealRuling(caseNumber, policeCaseNumber, appealCaseNumber)
})

function randomPoliceCaseNumber() {
  return `007-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)}`
}

function randomCourtCaseNumber() {
  return `R-${Math.floor(Math.random() * 1000)}/${new Date().getFullYear()}`
}

function randomAppealCaseNumber() {
  return `${Math.floor(Math.random() * 1000)}/${new Date().getFullYear()}`
}
