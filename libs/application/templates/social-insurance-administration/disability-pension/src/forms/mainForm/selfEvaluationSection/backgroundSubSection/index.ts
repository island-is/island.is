import {
    buildSubSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { maritalStatusField } from './maritalStatus'
import { residenceField } from './residence'
import { childrenField } from './children'
import { icelandicCapabilityField } from './icelandicCapability'
import { languageField } from './language'
import { employmentField } from './employment'
import { previousEmploymentField } from './previousEmployment'
import { educationLevelField } from './educationLevel'
import { employmentImportanceField } from './employmentImportance'
import { rehabilitationOrTherapyField } from './rehabilitationOrTherapy'
import { biggestIssueField } from './biggestIssue'
import { SectionRouteEnum } from '../../../../types'
import { assistanceField } from './assistance'
import { employmentCapabilityField } from './employmentCapability'

export const backgroundInfoSubSection =
  buildSubSection({
    id: SectionRouteEnum.BACKGROUND_INFO,
    title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
    children: [
      //assistanceField,
      //maritalStatusField,
      //residenceField,
      //childrenField,
      //icelandicCapabilityField,
      //languageField,
     //employmentField,
      //previousEmploymentField,
      //educationLevelField, //TODO - need data from service
      employmentCapabilityField,
      employmentImportanceField,
      rehabilitationOrTherapyField,
      biggestIssueField,
    ],
  })
