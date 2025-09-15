import { buildSection, buildTextField } from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'

export const extraInfoSection = buildSection({
  id: SectionRouteEnum.EXTRA_INFO,
  tabTitle: m.extraInfo.tabTitle,
  title: m.extraInfo.tabTitle,
  children: [
    buildTextField({
      id: SectionRouteEnum.EXTRA_INFO,
      title: m.extraInfo.title,
      description: m.extraInfo.description,
      placeholder: m.extraInfo.placeholder,
      variant: 'textarea',
      backgroundColor: 'blue',
      rows: 10,
      marginTop: 2,
    }),
  ],
})
