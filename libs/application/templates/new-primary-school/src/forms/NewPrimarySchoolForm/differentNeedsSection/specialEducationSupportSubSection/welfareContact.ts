import {
  buildRadioField,
  buildTextField,
  NO,
  YES,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  differentNeedsMessages,
  sharedMessages,
} from '../../../../lib/messages'
import { hasSpecialEducationWelfareContact } from '../../../../utils/conditionUtils'
import { CaseWorkerInputTypeEnum } from '../../../../utils/constants'
import {
  getDefaultSupportCaseworker,
  getWelfareContactDescription,
  hasDefaultSupportCaseworker,
} from '../../../../utils/newPrimarySchoolUtils'

export const welfareContact = [
  buildRadioField({
    id: 'specialEducationSupport.hasWelfareContact',
    title: differentNeedsMessages.specialEducationSupport.hasWelfareContact,
    description: getWelfareContactDescription,
    width: 'half',
    required: true,
    options: [
      {
        label: sharedMessages.yes,
        dataTestId: 'has-welfare-contact',
        value: YES,
      },
      {
        label: sharedMessages.no,
        dataTestId: 'no-has-welfare-contact',
        value: NO,
      },
    ],
    defaultValue: (application: Application) =>
      hasDefaultSupportCaseworker(
        application.externalData,
        CaseWorkerInputTypeEnum.SupportManager,
      ),
  }),
  buildTextField({
    id: 'specialEducationSupport.welfareContact.name',
    title: differentNeedsMessages.support.welfareContactName,
    width: 'half',
    required: true,
    condition: hasSpecialEducationWelfareContact,
    defaultValue: (application: Application) =>
      getDefaultSupportCaseworker(
        application.externalData,
        CaseWorkerInputTypeEnum.SupportManager,
      )?.name,
  }),
  buildTextField({
    id: 'specialEducationSupport.welfareContact.email',
    title: differentNeedsMessages.support.welfareContactEmail,
    width: 'half',
    required: true,
    condition: hasSpecialEducationWelfareContact,
    defaultValue: (application: Application) =>
      getDefaultSupportCaseworker(
        application.externalData,
        CaseWorkerInputTypeEnum.SupportManager,
      )?.email,
  }),
]
