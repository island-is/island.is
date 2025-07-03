import {
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'

export const extraInfoSection =
  buildSection({
    id: SectionRouteEnum.EXTRA_INFO,
    tabTitle: disabilityPensionFormMessage.extraInfo.tabTitle,
    children: [
      buildTextField({
        id: SectionRouteEnum.EXTRA_INFO,
        title: disabilityPensionFormMessage.extraInfo.title,
        description: disabilityPensionFormMessage.extraInfo.description,
        placeholder: disabilityPensionFormMessage.extraInfo.placeholder,
        variant: 'textarea',
        backgroundColor: 'blue',
      }),
    ]
  })
