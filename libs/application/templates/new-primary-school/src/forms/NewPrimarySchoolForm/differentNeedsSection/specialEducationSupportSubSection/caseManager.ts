import {
  buildRadioField,
  buildTextField,
  NO,
  YES,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../../lib/messages'
import { hasSpecialEducationCaseManager } from '../../../../utils/conditionUtils'
import { CaseWorkerInputTypeEnum } from '../../../../utils/constants'
import {
  getDefaultSupportCaseworker,
  hasDefaultSupportCaseworker,
} from '../../../../utils/newPrimarySchoolUtils'

export const caseManager = [
  buildRadioField({
    id: 'specialEducationSupport.hasCaseManager',
    title:
      newPrimarySchoolMessages.differentNeeds.specialEducationHasCaseManager,
    description:
      newPrimarySchoolMessages.differentNeeds.hasCaseManagerDescription,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: newPrimarySchoolMessages.shared.yes,
        dataTestId: 'has-case-manager',
        value: YES,
      },
      {
        label: newPrimarySchoolMessages.shared.no,
        dataTestId: 'no-has-case-manager',
        value: NO,
      },
    ],
    defaultValue: (application: Application) =>
      hasDefaultSupportCaseworker(
        application.externalData,
        CaseWorkerInputTypeEnum.CaseManager,
      ),
  }),
  buildTextField({
    id: 'specialEducationSupport.caseManager.name',
    title: newPrimarySchoolMessages.differentNeeds.caseManagerName,
    width: 'half',
    required: true,
    condition: hasSpecialEducationCaseManager,
    defaultValue: (application: Application) =>
      getDefaultSupportCaseworker(
        application.externalData,
        CaseWorkerInputTypeEnum.CaseManager,
      )?.name,
  }),
  buildTextField({
    id: 'specialEducationSupport.caseManager.email',
    title: newPrimarySchoolMessages.differentNeeds.caseManagerEmail,
    width: 'half',
    required: true,
    condition: hasSpecialEducationCaseManager,
    defaultValue: (application: Application) =>
      getDefaultSupportCaseworker(
        application.externalData,
        CaseWorkerInputTypeEnum.CaseManager,
      )?.email,
  }),
]
