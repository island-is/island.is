import {
    buildSubSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { maritalStatusField } from './maritalStatus'
import { residenceField } from './residence'
import { childrenField } from './children'

export const backgroundRoute = 'backgroundInfo'

export const backgroundInfoSubSection =
  buildSubSection({
    id: 'backgroundInfo',
    title: disabilityPensionFormMessage.backgroundInfo.title,
    children: [
      maritalStatusField,
      residenceField,
      childrenField,
    ],
  })
