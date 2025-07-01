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
import { SectionRouteEnum } from '../../../../lib/routes'

export const backgroundInfoSubSection =
  buildSubSection({
    id: SectionRouteEnum.BACKGROUND_INFO,
    title: disabilityPensionFormMessage.backgroundInfo.title,
    children: [
      maritalStatusField,
      residenceField,
      childrenField,
      icelandicCapabilityField,
      languageField,
      employmentField,
      previousEmploymentField,
    ],
  })
