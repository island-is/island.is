import {
  buildHiddenInput,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../../lib/messages'
import {
  hasSpecialEducationSubType,
  shouldShowPage,
} from '../../../../utils/conditionUtils'
import { ApplicationFeatureKey } from '../../../../utils/constants'
import { assessmentOfSupportNeeds } from './assessmentOfSupportNeeds'
import { caseManager } from './caseManager'
import { childAndAdolescentPsychiatryServices } from './childAndAdolescentPsychiatryServices'
import { childProtectiveServices } from './childProtectiveServices'
import { confirmedDiagnosis } from './confirmedDiagnosis'
import { integratedServices } from './integratedServices'
import { otherSpecialists } from './otherSpecialists'
import { servicesFromMunicipality } from './servicesFromMunicipality'
import { welfareContact } from './welfareContact'

export const specialEducationSupportSubSection = buildSubSection({
  id: 'specialEducationSupportSubSection',
  title: newPrimarySchoolMessages.differentNeeds.supportSubSectionTitle,
  condition: (answers, externalData) =>
    shouldShowPage(answers, externalData, ApplicationFeatureKey.SOCIAL_INFO) &&
    hasSpecialEducationSubType(answers, externalData),
  children: [
    buildMultiField({
      id: 'specialEducationSupport',
      title: newPrimarySchoolMessages.differentNeeds.supportSubSectionTitle,
      description:
        newPrimarySchoolMessages.differentNeeds
          .specialEducationSupportDescription,
      children: [
        ...welfareContact,
        ...caseManager,
        ...integratedServices,
        ...assessmentOfSupportNeeds,
        ...confirmedDiagnosis,
        ...otherSpecialists,
        ...servicesFromMunicipality,
        ...childAndAdolescentPsychiatryServices,
        ...childProtectiveServices,
        buildHiddenInput({
          id: 'specialEducationSupport.triggerHiddenInput',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
