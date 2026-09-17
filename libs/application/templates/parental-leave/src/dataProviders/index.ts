import { defineTemplateApi } from '@island.is/application/types'

/**
 * Runs after the other providers (`order` defaults to 0 for them). It reads their
 * output: the applicant's gender from `person`, and — for a follow-up — whether
 * the application it continues was on mock data, from `previousApplication`.
 * Without the ordering these race and it sees neither.
 */
export const ChildrenApi = defineTemplateApi({
  action: 'getChildren',
  externalDataId: 'children',
  order: 1,
})

export const GetPersonInformation = defineTemplateApi({
  action: 'getPerson',
  externalDataId: 'person',
})

/**
 * Loads the application a `change` / `residenceGrant` application continues, so
 * its answers can seed this one and serve as the baseline the change form diffs
 * against. Returns null for a first-time application.
 */
export const PreviousApplicationApi = defineTemplateApi({
  action: 'getPreviousApplication',
  externalDataId: 'previousApplication',
})
