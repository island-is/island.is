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

/**
 * What VMST holds for the applicant, so a follow-up can start without asking
 * VMST again. Runs before `ChildrenApi`, which reads its list.
 */
export const VMSTParentalLeavesApi = defineTemplateApi({
  action: 'getVMSTParentalLeaves',
  externalDataId: 'VMSTParentalLeaves',
})

export const GetPersonInformation = defineTemplateApi({
  action: 'getPerson',
  externalDataId: 'person',
})
