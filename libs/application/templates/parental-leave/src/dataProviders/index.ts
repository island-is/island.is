import { defineTemplateApi } from '@island.is/application/types'

/**
 * Runs after the other providers (`order` defaults to 0 for them). It reads the
 * applicant's gender from `person`; without the ordering they race and it may
 * not see it.
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
