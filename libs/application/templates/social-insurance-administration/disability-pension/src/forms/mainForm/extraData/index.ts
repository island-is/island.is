import {
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'

export const extraDataSection =
  buildSection({
    id: SectionRouteEnum.EXTRA_INFO,
    tabTitle: disabilityPensionFormMessage.extraData.tabTitle,
    children: [
      buildTextField({
        id: SectionRouteEnum.EXTRA_INFO,
        title: disabilityPensionFormMessage.extraData.title,
        description: disabilityPensionFormMessage.extraData.description,
        placeholder: disabilityPensionFormMessage.extraData.placeholder,
        variant: 'textarea',
        backgroundColor: 'blue',
      }),
    ]
  })
