import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

const requestedDocuments = (answers: FormValue) =>
  getValueViaPath<string[]>(answers, 'institutionRequestedDocuments') ?? []

export const institutionRequestedExemptionReason = (answers: FormValue) =>
  requestedDocuments(answers).includes('exemptionReason')

export const institutionRequestedCustodyAgreement = (answers: FormValue) =>
  requestedDocuments(answers).includes('custodyAgreement')

export const institutionRequestedChangedCircumstances = (answers: FormValue) =>
  requestedDocuments(answers).includes('changedCircumstances')
